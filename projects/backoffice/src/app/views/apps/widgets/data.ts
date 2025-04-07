import { currency, currentYear } from '@/app/common/constants'

export type ProjectType = {
  project: string
  client: string
  team: string[]
  deadline: string
  progressValue: number
  progressType: string
}

export type ScheduleType = {
  time: string
  title: string
  type: string
  duration: string
}

type StateType = {
  title: string;
  iconColor?: string;
  value: string;
  change: string;
  period: string;
  icon: string;
  change_type: string;
  badge?: string;
  badgeColor?: string;
};

export type TransactionType = {
  id: string
  date: string
  amount: string
  status: string
  description: string
}

export type FriendRequestType = {
  profile: string
  name: string
  mutual: number
}

export const stateData: StateType[] = [
  {
    title: 'Total Orders',
    iconColor: 'primary',
    value: '13,647',
    change: '2.3%',
    period: 'Last Week',
    icon: 'bx-layer',
    change_type: 'success',
    badge: '2.3',
    badgeColor: 'success',
  },
  {
    title: 'New Leads',
    iconColor: 'success',
    value: '9,526',
    change: '8.1%',
    period: 'Last Month',
    icon: 'bx-award',
    change_type: 'success',
    badge: '8.1',
    badgeColor: 'success',
  },
  {
    title: 'Deals',
    iconColor: 'danger',
    value: '976',
    change: '0.3%',
    period: 'Last Month',
    icon: 'bxs-backpack',
    change_type: 'danger',
    badge: '0.3',
    badgeColor: 'danger',
  },
  {
    title: 'Booked Revenue',
    iconColor: 'warning',
    value: `${currency}123.6k`,
    change: '10.6%',
    period: 'Last Month',
    icon: 'bx-dollar-circle',
    change_type: 'danger',
    badge: '10.6',
    badgeColor: 'danger',
  },
];

export const state2Data = [
  {
    icon: 'iconamoon:3d-duotone',
    iconColor: 'info',
    amount: '59.6',
    title: 'Total Income',
    badge: '8.72',
    badgeColor: 'success',
    badgeIcon: 'bx bx-doughnut-chart',
  },
  {
    icon: 'iconamoon:category-duotone',
    iconColor: 'success',
    amount: '24.03',
    title: 'Total Expenses',
    badge: '3.28',
    badgeColor: 'danger',
    badgeIcon: 'bx bx-bar-chart-alt-2',
  },
  {
    icon: 'iconamoon:store-duotone',
    iconColor: 'purple',
    amount: '48.7',
    title: 'Investments',
    badge: '5.69',
    badgeColor: 'danger',
    badgeIcon: 'bx bx-building-house',
  },
  {
    icon: 'iconamoon:gift-duotone',
    iconColor: 'orange',
    amount: '11.3',
    title: 'Savings',
    badge: '10.58',
    badgeColor: 'success',
    badgeIcon: 'bx bx-bowl-hot',
  },
  {
    icon: 'iconamoon:certificate-badge-duotone',
    iconColor: 'warning',
    amount: '5.5',
    title: 'Profits',
    badge: '8.72',
    badgeColor: 'success',
    badgeIcon: 'bx bx-cricket-ball',
  },
]

export const RecentProject: ProjectType[] = [
  {
    project: 'Zelogy',
    client: 'Daniel Olsen',
    team: [
      'assets/images/users/avatar-2.jpg',
      'assets/images/users/avatar-3.jpg',
      'assets/images/users/avatar-4.jpg',
    ],
    deadline: '12 April ' + currentYear,
    progressValue: 33,
    progressType: 'primary',
  },
  {
    project: 'Shiaz',
    client: 'Jack Roldan',
    team: [
      'assets/images/users/avatar-1.jpg',
      'assets/images/users/avatar-5.jpg',
    ],
    deadline: '10 April ' + currentYear,
    progressValue: 74,
    progressType: 'success',
  },
  {
    project: 'Holderick',
    client: 'Betty Cox',
    team: [
      'assets/images/users/avatar-5.jpg',
      'assets/images/users/avatar-2.jpg',
      'assets/images/users/avatar-3.jpg',
    ],
    deadline: '31 March ' + currentYear,
    progressValue: 50,
    progressType: 'warning',
  },
  {
    project: 'Feyvux',
    client: 'Carlos Johnson',
    team: [
      'assets/images/users/avatar-3.jpg',
      'assets/images/users/avatar-7.jpg',
      'assets/images/users/avatar-6.jpg',
    ],
    deadline: '25 March ' + currentYear,
    progressValue: 92,
    progressType: 'primary',
  },
  {
    project: 'Xavlox',
    client: 'Lorraine Cox',
    team: ['assets/images/users/avatar-7.jpg'],
    deadline: '22 March ' + currentYear,
    progressValue: 48,
    progressType: 'danger',
  },
  {
    project: 'Mozacav',
    client: 'Delores Young',
    team: [
      'assets/images/users/avatar-3.jpg',
      'assets/images/users/avatar-4.jpg',
      'assets/images/users/avatar-2.jpg',
    ],
    deadline: '15 March ' + currentYear,
    progressValue: 21,
    progressType: 'primary',
  },
]

export const ScheduleData: ScheduleType[] = [
  {
    time: '09:00',
    title: 'Setup Github Repository',
    type: 'primary',
    duration: '09:00 - 10:00',
  },
  {
    time: '10:00',
    title: 'Design Review - Larkon Admin',
    type: 'success',
    duration: '10:00 - 10:30',
  },
  {
    time: '11:00',
    title: 'Meeting with BD Team',
    type: 'info',
    duration: '11:00 - 12:30',
  },
  {
    time: '01:00',
    title: 'Meeting with Design Studio',
    type: 'warning',
    duration: '01:00 - 02:00',
  },
]

export const FriendRequest: FriendRequestType[] = [
  {
    profile: 'assets/images/users/avatar-10.jpg',
    name: 'Victoria P. Miller',
    mutual: 0,
  },
  {
    profile: 'assets/images/users/avatar-9.jpg',
    name: 'Dallas C. Payne',
    mutual: 856,
  },
  {
    profile: 'assets/images/users/avatar-8.jpg',
    name: 'Florence A. Lopez',
    mutual: 52,
  },
  {
    profile: 'assets/images/users/avatar-7.jpg',
    name: 'Gail A. Nix',
    mutual: 12,
  },
  {
    profile: 'assets/images/users/avatar-6.jpg',
    name: 'Lynne J. Petty',
    mutual: 0,
  },
  {
    profile: 'assets/images/users/avatar-5.jpg',
    name: 'Victoria P. Miller',
    mutual: 0,
  },
  {
    profile: 'assets/images/users/avatar-4.jpg',
    name: 'Dallas C. Payne',
    mutual: 856,
  },
  {
    profile: 'assets/images/users/avatar-3.jpg',
    name: 'Florence A. Lopez',
    mutual: 52,
  },
  {
    profile: 'assets/images/users/avatar-2.jpg',
    name: 'Gail A. Nix',
    mutual: 12,
  },
  {
    profile: 'assets/images/users/avatar-1.jpg',
    name: 'Lynne J. Petty',
    mutual: 0,
  },
]

export const TransactionsList: TransactionType[] = [
  {
    id: '#98521',
    date: '24 April, ' + currentYear,
    amount: '120.55',
    status: 'Cr',
    description: 'Commisions',
  },
  {
    id: '#20158',
    date: '24 April, ' + currentYear,
    amount: '9.68',
    status: 'Cr',
    description: 'Affiliates',
  },
  {
    id: '#36589',
    date: '20 April, ' + currentYear,
    amount: '105.22',
    status: 'Dr',
    description: 'Grocery',
  },
  {
    id: '#95362',
    date: '18 April, ' + currentYear,
    amount: '80.59',
    status: 'Cr',
    description: 'Refunds',
  },
  {
    id: '#75214',
    date: '18 April, ' + currentYear,
    amount: '750.95',
    status: 'Dr',
    description: 'Bill Payments',
  },

  {
    id: '#75215',
    date: '17 April, ' + currentYear,
    amount: '455.62',
    status: 'Dr',
    description: 'Electricity',
  },
  {
    id: '#75216',
    date: '17 April, ' + currentYear,
    amount: '102.77',
    status: 'Cr',
    description: 'Interest',
  },
  {
    id: '#75217',
    date: '16 April, ' + currentYear,
    amount: '79.49',
    status: 'Cr',
    description: 'Refunds',
  },
  {
    id: '#75218',
    date: '05 April, ' + currentYear,
    amount: '980.00',
    status: 'Dr',
    description: 'Shopping',
  },
]

