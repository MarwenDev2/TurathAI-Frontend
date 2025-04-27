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
    icon: 'solar:widget-5-bold-duotone',
    label: 'Dashboard',
    link:'/index'
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
    icon: 'solar:t-shirt-bold-duotone',
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
    icon: 'solar:calendar-bold-duotone', // Using a calendar icon for events
    label: 'Event Management',
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
    icon: 'solar:t-shirt-bold-duotone',
    label: 'Forum Management',
    collapsed: true,
    subMenu: [
      {
        key: 'forums-list',
        label: 'List',
        link: '/forums/list',
        parentKey: 'forums',
      },
      {
        key: 'forums-details',
        label: 'Details',
        link: '/forums/details',
        parentKey: 'forums',
      },
      {
        key: 'forums-edit',
        label: 'Edit',
        link: '/forums/edit',
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

              /////////////// Itenary management
  {
    key: 'itenary',
    icon: 'solar:t-shirt-bold-duotone',
    label: 'Itenary Management',
    collapsed: true,
    subMenu: [
      {
        key: 'itenary-list',
        label: 'List',
        link: '/itenary/list',
        parentKey: 'itenary',
      },
      {
        key: 'itenary-details',
        label: 'Details',
        link: '/itenary/details',
        parentKey: 'itenary',
      },
      {
        key: 'itenary-edit',
        label: 'Edit',
        link: '/itenary/edit',
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
            ///////////// Local Insight management
            {
              key: 'local-insight',
              icon: 'solar:t-shirt-bold-duotone',
              label: 'Local Insight Management',
              collapsed: true,
              subMenu: [
                {
                  key: 'local-insight-list',
                  label: 'List',
                  link: '/local-insight/list',
                  parentKey: 'local-insight',
                },
                {
                  key: 'local-insight-details',
                  label: 'Details',
                  link: '/local-insight/details',
                  parentKey: 'local-insight',
                },
                {
                  key: 'local-insight-edit',
                  label: 'Edit',
                  link: '/local-insight/edit',
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
    icon: 'solar:t-shirt-bold-duotone',
    label: 'Heritage Site Management',
    collapsed: true,
    subMenu: [
      {
        key: 'sites-list',
        label: 'List',
        link: '/sites/list',
        parentKey: 'sites',
      },
      {
        key: 'sites-details',
        label: 'Details',
        link: '/sites/details',
        parentKey: 'sites',
      },
      {
        key: 'sites-edit',
        label: 'Edit',
        link: '/sites/edit',
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
    key: 'category',
    icon: 'solar:clipboard-list-bold-duotone',
    label: 'Category',
    collapsed: true,
    subMenu: [
      {
        key: 'category-list',
        label: 'List',
        link: '/category/list',
        parentKey: 'category',
      },
      {
        key: 'category-edit',
        label: 'Edit',
        link: '/category/edit',
        parentKey: 'category',
      },
      {
        key: 'category-create',
        label: 'Create',
        link: '/category/add',
        parentKey: 'category',
      }
    ],
  },
  {
    key: 'inventory',
    icon: 'solar:box-bold-duotone',
    label: 'Inventory',
    collapsed: true,
    subMenu: [
      {
        key: 'inventory-warehouse',
        label: 'Warehouse',
        link: '/inventory/warehouse',
        parentKey: 'inventory',
      },
      {
        key: 'inventory-received-order',
        label: 'Received Order',
        link: '/inventory/received-order',
        parentKey: 'inventory',
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
    icon: 'solar:chat-square-like-bold-duotone',
    label: 'Profile',
    link: '/pages/profile',
  },
  {
    key: 'reviews',
    icon: 'solar:chat-square-like-bold-duotone',
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
  },
{
    key: 'authentication',
    label: 'Authentication',
    isTitle: false,
    icon: 'solar:lock-keyhole-bold-duotone',
    collapsed: true,
    subMenu: [
      {
        key: 'sign-in',
        label: 'Sign In',
        link: '/auth/signin',
        parentKey: 'authentication',
      },
      {
        key: 'signup',
        label: 'Sign Up',
        link: '/auth/signup',
        parentKey: 'authentication',
      },
      {
        key: 'reset-pass',
        label: 'Reset Password',
        link: '/auth/password',
        parentKey: 'authentication',
      },
      {
        key: 'lock-screen',
        label: 'Lock Screen',
        link: '/auth/lock-screen',
        parentKey: 'authentication',
      }
    ],
  },
  {
    key: 'components',
    label: 'COMPONENTS',
    isTitle: true,
  },
  {
    key: 'base-ui',
    icon: 'solar:bookmark-square-bold-duotone',
    label: 'Base UI',
    collapsed: true,
    subMenu: [
      {
        key: 'base-ui-accordion',
        label: 'Accordion',
        link: '/ui/accordion',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-alerts',
        label: 'Alerts',
        link: '/ui/alerts',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-avatar',
        label: 'Avatar',
        link: '/ui/avatar',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-badge',
        label: 'Badge',
        link: '/ui/badge',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-breadcrumb',
        label: 'Breadcrumb',
        link: '/ui/breadcrumb',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-buttons',
        label: 'Buttons',
        link: '/ui/buttons',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-card',
        label: 'Card',
        link: '/ui/card',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-carousel',
        label: 'Carousel',
        link: '/ui/carousel',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-collapse',
        label: 'Collapse',
        link: '/ui/collapse',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-dropdown',
        label: 'Dropdown',
        link: '/ui/dropdown',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-list-group',
        label: 'List Group',
        link: '/ui/list-group',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-modal',
        label: 'Modal',
        link: '/ui/modal',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-tabs',
        label: 'Tabs',
        link: '/ui/tabs',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-offcanvas',
        label: 'Offcanvas',
        link: '/ui/offcanvas',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-pagination',
        label: 'Pagination',
        link: '/ui/pagination',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-placeholders',
        label: 'Placeholders',
        link: '/ui/placeholders',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-popovers',
        label: 'Popovers',
        link: '/ui/popovers',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-progress',
        label: 'Progress',
        link: '/ui/progress',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-scrollspy',
        label: 'Scrollspy',
        link: '/ui/scrollspy',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-spinners',
        label: 'Spinners',
        link: '/ui/spinners',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-toasts',
        label: 'Toasts',
        link: '/ui/toasts',
        parentKey: 'base-ui',
      },
      {
        key: 'base-ui-tooltips',
        label: 'Tooltips',
        link: '/ui/tooltips',
        parentKey: 'base-ui',
      },
    ],
  },
  {
    key: 'advanced-ui',
    icon: 'solar:case-round-bold-duotone',
    label: 'Advanced UI',
    collapsed: true,
    subMenu: [
      {
        key: 'advanced-ui-ratings',
        label: 'Ratings',
        link: '/extended/ratings',
        parentKey: 'advanced-ui',
      },
      {
        key: 'advanced-ui-sweet-alert',
        label: 'Sweet Alert',
        link: '/extended/sweetalert',
        parentKey: 'advanced-ui',
      },
      {
        key: 'advanced-ui-swiper-slider',
        label: 'Swiper Slider',
        link: '/extended/swiper-silder',
        parentKey: 'advanced-ui',
      },
      {
        key: 'advanced-ui-scrollbar',
        label: 'Scrollbar',
        link: '/extended/scrollbar',
        parentKey: 'advanced-ui',
      },
      {
        key: 'advanced-ui-toastify',
        label: 'Toastify',
        link: '/extended/toastify',
        parentKey: 'advanced-ui',
      },
    ],
  },
  {
    key: 'charts',
    icon: 'solar:pie-chart-2-bold-duotone',
    label: 'Charts',
    collapsed: true,
    subMenu: [
      {
        key: 'charts-area',
        label: 'Area',
        link: '/charts/area',
        parentKey: 'charts',
      },
      {
        key: 'charts-bar',
        label: 'Bar',
        link: '/charts/bar',
        parentKey: 'charts',
      },
      {
        key: 'charts-bubble',
        label: 'Bubble',
        link: '/charts/bubble',
        parentKey: 'charts',
      },
      {
        key: 'charts-candl-stick',
        label: 'Candlestick',
        link: '/charts/candlestick',
        parentKey: 'charts',
      },
      {
        key: 'charts-column',
        label: 'Column',
        link: '/charts/column',
        parentKey: 'charts',
      },
      {
        key: 'charts-heatmap',
        label: 'Heatmap',
        link: '/charts/heatmap',
        parentKey: 'charts',
      },
      {
        key: 'charts-line',
        label: 'Line',
        link: '/charts/line',
        parentKey: 'charts',
      },
      {
        key: 'charts-mixed',
        label: 'Mixed',
        link: '/charts/mixed',
        parentKey: 'charts',
      },
      {
        key: 'charts-timeline',
        label: 'Timeline',
        link: '/charts/timeline',
        parentKey: 'charts',
      },
      {
        key: 'charts-boxplot',
        label: 'Boxplot',
        link: '/charts/boxplot',
        parentKey: 'charts',
      },
      {
        key: 'charts-treemap',
        label: 'Treemap',
        link: '/charts/treemap',
        parentKey: 'charts',
      },
      {
        key: 'charts-pie',
        label: 'Pie',
        link: '/charts/pie',
        parentKey: 'charts',
      },
      {
        key: 'charts-radar',
        label: 'Radar',
        link: '/charts/radar',
        parentKey: 'charts',
      },
      {
        key: 'charts-radialbar',
        label: 'RadialBar',
        link: '/charts/radialbar',
        parentKey: 'charts',
      },
      {
        key: 'charts-scatter',
        label: 'Scatter',
        link: '/charts/scatter',
        parentKey: 'charts',
      },
      {
        key: 'charts-polar-area',
        label: 'Polar Area',
        link: '/charts/polar-area',
        parentKey: 'charts',
      },
    ],
  },
  {
    key: 'forms',
    icon: 'solar:book-bookmark-bold-duotone',
    label: 'Forms',
    collapsed: true,
    subMenu: [
      {
        key: 'forms-basic-elements',
        label: 'Basic Elements',
        link: '/forms/basic',
        parentKey: 'forms',
      },
      {
        key: 'forms-checkbox&radio',
        label: 'Checkbox & Radio',
        link: '/forms/checkbox-radio',
        parentKey: 'forms',
      },
      {
        key: 'forms-choice-select',
        label: 'Choice Select',
        link: '/forms/choices',
        parentKey: 'forms',
      },
      {
        key: 'forms-clipboard',
        label: 'Clipboard',
        link: '/forms/clipboard',
        parentKey: 'forms',
      },
      {
        key: 'forms-flat-picker',
        label: 'Flatpicker',
        link: '/forms/flatepicker',
        parentKey: 'forms',
      },
      {
        key: 'forms-validation',
        label: 'Validation',
        link: '/forms/validation',
        parentKey: 'forms',
      },
      {
        key: 'forms-wizard',
        label: 'Wizard',
        link: '/forms/wizard',
        parentKey: 'forms',
      },
      {
        key: 'forms-file-uploads',
        label: 'File Upload',
        link: '/forms/fileuploads',
        parentKey: 'forms',
      },
      {
        key: 'forms-editors',
        label: 'Editors',
        link: '/forms/editors',
        parentKey: 'forms',
      },
      {
        key: 'forms-input-mask',
        label: 'Input Mask',
        link: '/forms/input-mask',
        parentKey: 'forms',
      },
      {
        key: 'forms-slider',
        label: 'Slider',
        link: '/forms/range-slider',
        parentKey: 'forms',
      },
    ],
  },
  {
    key: 'tables',
    icon: 'solar:tuning-2-bold-duotone',
    label: 'Tables',
    collapsed: true,
    subMenu: [
      {
        key: 'tables-basic',
        label: 'Basic Tables',
        link: '/tables/basic',
        parentKey: 'tables',
      },
      {
        key: 'tables-datatable',
        label: 'Datatables',
        link: '/tables/datatable',
        parentKey: 'tables',
      },
    ],
  },
  {
    key: 'icons',
    icon: 'solar:ufo-2-bold-duotone',
    label: 'Icons',
    collapsed: true,
    subMenu: [
      {
        key: 'icons-boxicons',
        label: 'Boxicons',
        link: '/icons/boxicons',
        parentKey: 'icons',
      },
      {
        key: 'icons-solar',
        label: 'Solar Icons',
        link: '/icons/solar',
        parentKey: 'icons',
      },
    ],
  },
]
