-- Создание таблицы profiles (расширение auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  role text not null default 'buyer' check (role in ('buyer', 'employee')),
  name text,
  branch text,
  manager text
);

-- Включение Row Level Security (RLS) для profiles
alter table public.profiles enable row level security;

-- Политики для profiles (каждый видит всех, чтобы сотрудники видели покупателей, а покупатели - менеджеров)
create policy "Профили доступны для чтения всем авторизованным пользователям" 
on public.profiles for select using (auth.role() = 'authenticated');

-- Пользователи могут обновлять только свой профиль
create policy "Пользователи могут обновлять только свой профиль" 
on public.profiles for update using (auth.uid() = id);

-- Функция для автоматического создания профиля при регистрации в Supabase Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'role', 'buyer'));
  return new;
end;
$$ language plpgsql security definer;

-- Триггер для вызова функции
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Создание таблицы продуктов
create table public.products (
  id text primary key,
  article text not null,
  name text not null,
  category text not null,
  sub text,
  price numeric not null,
  price_no_vat numeric not null,
  pack integer not null default 1,
  sizes text,
  category_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

-- Продукты: чтение доступно всем анонимным и авторизованным
create policy "Продукты видны всем" 
on public.products for select using (true);


-- Создание таблицы заказов
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number integer generated always as identity, -- Читаемый номер заказа
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  shipping_date date not null,
  total numeric not null,
  status text not null default 'Сформирован'
);

alter table public.orders enable row level security;

-- Заказы: Покупатель видит только свои, Сотрудник видит все
create policy "Сотрудники видят все заказы" 
on public.orders for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'employee')
);

create policy "Покупатели видят свои заказы" 
on public.orders for select using (auth.uid() = user_id);

create policy "Авторизованные пользователи могут создавать заказы" 
on public.orders for insert with check (auth.uid() = user_id);

create policy "Сотрудники могут обновлять статусы заказов" 
on public.orders for update using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'employee')
);


-- Создание таблицы позиций заказа
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) not null,
  qty integer not null check (qty > 0),
  price_at_purchase numeric not null
);

alter table public.order_items enable row level security;

-- Детали заказа: читаются по тем же правилам, что и сам заказ
create policy "Содержимое заказов видно владельцам и сотрудникам" 
on public.order_items for select using (
  exists (
    select 1 from public.orders o 
    left join public.profiles p on p.id = auth.uid()
    where o.id = order_items.order_id and (o.user_id = auth.uid() or p.role = 'employee')
  )
);

create policy "Авторизованные пользователи могут добавлять товары в свой заказ" 
on public.order_items for insert with check (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
