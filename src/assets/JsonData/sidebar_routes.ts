export default [
  {
    display_name: {
      en: 'Main',
      ru: 'Основной',
      tm: 'Esasy'
    },
    route: '/',
    icon: 'bx bx-category-alt',
    sub: []
  },
  {
    display_name: {
      en: 'Orders',
      ru: 'Заказы',
      tm: 'Sargytlar'
    },
    route: '/orders',
    icon: 'bx bx-cart',
    sub: [
      {
        display_name: {
          en: 'Make order',
          ru: 'Сделать заказ',
          tm: 'Sargyt ýasamak'
        },
        route: '/orders/make-order',
        icon: 'bx bx-package'
      }
    ]
  },
  {
    display_name: {
      en: 'Clients',
      ru: 'Контакты',
      tm: 'Müşderiler'
    },
    route: '/contacts',
    icon: 'bx bx-user-pin',
    sub: []
  },
  {
    display_name: {
      en: 'Products',
      ru: 'Продукты',
      tm: 'Harytlar'
    },
    route: '/products',
    icon: 'bx bx-package',
    sub: []
  },
  {
    display_name: {
      en: 'Groups',
      ru: 'Группы',
      tm: 'Toparlar'
    },
    route: '/groups',
    icon: 'bx bx-box',
    sub: []
  },
  {
    display_name: {
      en: 'Settings',
      ru: 'Настройки',
      tm: 'Sazlamalar'
    },
    route: '/settings',
    icon: 'bx bx-cog',
    sub: []
  }
]