export type MenuItem = {
  key?: string
  label?: string
  icon?: string
  link?: string
  collapsed?: boolean
  subMenu?: any
  isTitle?: boolean
  badge?: any
  parentKey?: string
  disabled?: boolean
}
export const MENU: MenuItem[] = [
  {
    key: 'general',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'dashboards',
    icon: 'solar:pie-chart-2-bold-duotone', 
    label: 'Dashboard',
    link:''
  },
  {
    key: 'itinerary-statistics',
    icon: 'solar:chart-bold-duotone',
    label: 'Itinerary Statistics',
    link:'/itinerary-statistics'
  },
  ///////////////// Managements
  {
    key: 'users',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    label: 'Users',
    collapsed: true,
    subMenu: [
      {
        key: 'users-list',
        label: 'List',
        link: '/user/list',
        parentKey: 'users',
      },
      {
        key: 'users-create',
        label: 'Create',
        link: '/user/add',
        parentKey: 'users',
      }
    ],
  },
  {
    key: 'Business',
    icon: 'solar:t-shirt-bold-duotone',
    label: 'Business',
    collapsed: true,
    subMenu: [
      {
        key: 'businesses-list',
        label: 'List',
        link: '/businesses/list',
        parentKey: 'Business',
      },
      {
        key: 'businesses-create',
        label: 'Create',
        link: '/businesses/add',
        parentKey: 'Business',
      }
    ],
  },
  {
    key: 'event',
    icon: 'solar:calendar-bold-duotone',
    label: 'Events',
    collapsed: true,
    subMenu: [
      {
        key: 'event-list',
        label: 'List',
        link: '/event/list',
        parentKey: 'event',
      },
      {
        key: 'event-create',
        label: 'Create',
        link: '/event/add',
        parentKey: 'event',
      }
    ],
  },
  {
    key: 'forums',
    icon: 'solar:chat-round-line-bold-duotone', 
    label: 'Forums',
    collapsed: true,
    subMenu: [
      {
        key: 'forums-list',
        label: 'List',
        link: '/forums/list',
        parentKey: 'forums',
      },
      {
        key: 'forums-create',
        label: 'Create',
        link: '/forums/add',
        parentKey: 'forums',
      }
    ],
  },
  /////////////// Itinerary management
  {
    key: 'itenary',
    icon: 'solar:route-bold-duotone', 
    label: 'Itinerary',
    collapsed: true,
    subMenu: [
      {
        key: 'itenary-list',
        label: 'List',
        link: '/itenary/list',
        parentKey: 'itenary',
      },
      {
        key: 'itenary-create',
        label: 'Create',
        link: '/itenary/add',
        parentKey: 'itenary',
      },
    ],
  },
  {
    key: 'local-insight',
    icon: 'solar:compass-big-bold-duotone',  
    label: 'Local Insights',
    collapsed: true,
    subMenu: [
      {
        key: 'local-insight-list',
        label: 'List',
        link: '/local-insight/list',
        parentKey: 'local-insight',
      },
      {
        key: 'local-insight-create',
        label: 'Create',
        link: '/local-insight/add',
        parentKey: 'local-insight',
      }
    ],
  },
  {
    key: 'sites',
    icon: 'solar:earth-bold-duotone',
    label: 'Heritage Sites',
    collapsed: true,
    subMenu: [
      {
        key: 'sites-list',
        label: 'List',
        link: '/sites/list',
        parentKey: 'sites',
      },
      {
        key: 'sites-create',
        label: 'Create',
        link: '/sites/add',
        parentKey: 'sites',
      }
    ],
  },
  {
    key: 'users',
    label: 'Users',
    isTitle: true,
  },
  {
    key: 'profile',
    icon: 'solar:user-circle-bold-duotone',
    label: 'Profile',
    link: '/pages/profile',
  },
  {
    key: 'reviews',
    icon: 'solar:star-circle-bold-duotone',
    label: 'Reviews',
    collapsed: true,
    subMenu: [
      {
        key: 'reviews-list',
        label: 'All Reviews',
        link: '/reviews/list',
        parentKey: 'reviews',
      },
      {
        key: 'reviews-create',
        label: 'Add Review',
        link: '/reviews/add',
        parentKey: 'reviews',
      }
    ]
  },
  {
    key: 'wishlist',
    icon: 'solar:heart-angle-bold-duotone',
    label: 'Wishlists',
    collapsed: true,
    subMenu: [
      {
        key: 'wishlist-list',
        label: 'All Wishlists',
        link: '/wishlist/list',
        parentKey: 'wishlist',
      },
      {
        key: 'wishlist-create',
        label: 'Wishlist Insights',
        link: '/wishlist/add',
        parentKey: 'wishlist',
      }
    ]
  }
]