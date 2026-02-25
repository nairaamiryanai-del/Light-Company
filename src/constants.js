export const COLORS = {
    // 1. Primary Blue (Action, Accent, Logo)
    primary: "#214A8C",

    // 2. Dark Text (Base Color for text and borders)
    text: "#1A2332",

    // 3. Surface (Backgrounds)
    surface: "#FFFFFF",

    // --- Derived semi-transparent equivalents (NO NEW COLORS, ONLY RGBA) ---
    primaryDark: "rgba(33, 74, 140, 0.8)",    // primary at 80% opacity
    accent: "#214A8C",                         // Re-mapping old pink to primary
    accentLight: "rgba(33, 74, 140, 0.6)",     // primary at 60% opacity
    accentBlue: "#214A8C",                     // Re-mapping old secondary blue to primary
    bg: "rgba(26, 35, 50, 0.03)",              // text at 3% opacity
    surfaceHover: "rgba(33, 74, 140, 0.04)",   // primary at 4%
    textSecondary: "rgba(26, 35, 50, 0.6)",    // text at 60%
    textMuted: "rgba(26, 35, 50, 0.4)",        // text at 40%
    border: "rgba(26, 35, 50, 0.12)",          // text at 12%
    borderLight: "rgba(26, 35, 50, 0.06)",     // text at 6%

    // Re-mapping status colors to primary or text context to enforce strict 3-color rule
    success: "#214A8C",
    warning: "rgba(26, 35, 50, 0.8)",
    danger: "rgba(26, 35, 50, 0.9)",
};

export const CATEGORIES = [
    {
        id: "shoes",
        name: "Обувь",
        iconImg: "/cat_shoes.png",
        subcategories: [
            { id: "winter", name: "Зима" },
            { id: "summer", name: "Лето" },
            { id: "spring-autumn", name: "Весна-осень" },
            { id: "rubber", name: "Резина" },
            { id: "home", name: "Домашняя обувь" },
        ],
    },
    {
        id: "eva-sheets",
        name: "ЭВА-листы",
        iconImg: "/cat_eva.png",
        subcategories: [
            { id: "rhombus", name: "Ромб" },
            { id: "honeycomb", name: "Сота" },
            { id: "large-rhombus", name: "Крупный ромб" },
            { id: "bubble", name: "Пупырышки" },
        ],
    },
    {
        id: "doormats",
        name: "Придверные коврики",
        iconImg: "/cat_doormats.png",
        subcategories: [
            { id: "sizes", name: "По размерам" },
            { id: "pattern", name: "По рисунку" },
        ],
    },
    {
        id: "covers",
        name: "Чехлы",
        iconImg: "/cat_covers.png",
        subcategories: [{ id: "assortment", name: "Ассортимент" }],
    },
    {
        id: "car-covers",
        name: "Автонакидки",
        iconImg: "/cat_carseat.png",
        subcategories: [{ id: "all", name: "Все модели" }],
    },
    {
        id: "straps",
        name: "Стропа",
        iconImg: "/cat_sling.png",
        subcategories: [],
    },
    {
        id: "braid",
        name: "Тесьма",
        iconImg: "/cat_braid.png",
        subcategories: [],
    },
];

export const HQ = {
    address: "357748, Россия, Ставропольский край, г. Кисловодск, ул. Чехова, 66",
    mailAddress: "357700, Россия, Ставропольский край, г. Кисловодск ОПС 36 а/я 5",
    phones: [
        { label: "Центральный офис", number: "+7 (863) 303-34-23" },
        { label: "Бесплатный по России", number: "8 (800) 550-60-67" },
        { label: "Коммерческий отдел", number: "+7 (928) 97-1111-2" },
        { label: "Отдел контроля качества", number: "+7 (928) 35-1111-2" },
    ],
    email: "light-c@mail.ru",
    schedule: "Пн.-Пт. с 09:00 до 18:00, перерыв 12:00-13:00. Сб., Вс. — выходной",
};

export const BRANCHES = [
    { region: "ЦФО (Москва)", address: "Московская область, г. Дзержинский, Дзержинское шоссе, 2", phone: "+7 (916) 017-44-54, +7 (928) 6-500-900", email: "light-c@mail.ru" },
    { region: "Санкт-Петербург", address: "г. Санкт-Петербург, метро Фрунзенская, ул. Киевская, 5А3, склад 58", phone: "+7 (921) 569-84-59, +7 (928) 370-95-75", email: "obyvlait.spb@mail.ru" },
    { region: "Волгоградская область", address: "г. Волгоград, ул. Шопена, 4Б", phone: "+7 (960) 869-41-00", email: "light.volgograd@mail.ru" },
    { region: "Воронежская область", address: "г. Воронеж, ул. Волгоградская, д. 30, офис 333", phone: "+7 (920) 212-63-84", email: "light-voronej@mail.ru" },
    { region: "Свердловская область (Екатеринбург)", address: "г. Екатеринбург, ул. Фронтовых бригад, 15/15", phone: "+7 (992) 018-38-01", email: "company-light@mail.ru" },
    { region: "Ивановская область", address: "г. Иваново, ул. Громобоя, д1, территория базы \"Зима-Авто\"", phone: "+7 (910) 991-28-78, +7 (938) 355-19-38", email: "light-i37@mail.ru" },
    { region: "Республика Татарстан (Казань)", address: "г. Казань, Горьковское шоссе 53а, офис 209", phone: "+7 (917) 273-76-81", email: "light-kzn@bk.ru" },
    { region: "Краснодарский край", address: "г. Краснодар, хутор Октябрьский, ул. Живописная, 72, офис 27", phone: "+7 (918) 381-21-21, +7 (918) 997-92-25", email: "company.light@mail.ru" },
    { region: "Республика Крым", address: "г. Симферополь, ул. Жени Дерюгиной, 9А", phone: "+7 (978) 746-69-08", email: "light-krim@mail.ru" },
    { region: "Самарская область", address: "пос. Смышляевка, ул. Механиков, 2, офис 11", phone: "+7 (927) 009-71-06, +7 (938) 349-19-38", email: "light-samara@mail.ru" },
    { region: "Саратовская область", address: "г. Саратов, пос. Строитель, ул. Автокомбинатовская, 12", phone: "+7 (919) 839-81-71", email: "light-saratov@mail.ru" },
    { region: "Республика Башкортостан (Уфа)", address: "г. Уфа, ул. Трамвайная 16/6 «б»", phone: "+7 (937) 314-45-33", email: "ufa.light-c@yandex.ru" },
];

export const DEALERS = [
    { region: "Республика Беларусь", company: "ООО \"РосОбувьТрейд\"", office: "г. Минск, ул. Платонова, 36, каб. 18", warehouse: "г. Минск, ул. Платонова, 34/1", phone: "+375 29 679 63 61, +375 29 233-31-69", email: "rosobuvtorg@mail.ru", site: "www.rosobuvtrad.by" },
];
