import { currentYear } from '@/app/common/constants'

export type UserType = {
  name: string
  avatar: string
}

export type TodoType = {
  task_name: string
  create_date: string
  time: string
  due_date: string
  assigned: UserType
  status: string
  priority: string
  checked: boolean
}

export const TodoData: TodoType[] = [
  {
    task_name: 'Review system logs for any reported errors',
    create_date: '23 April, ' + currentYear,
    time: '05:09 PM',
    due_date: '30 April, ' + currentYear,
    assigned: {
      name: 'Sean Kemper',
      avatar: 'assets/images/users/avatar-2.jpg',
    },
    status: 'In-progress',
    priority: 'High',
    checked: false,
  },
  {
    task_name: 'Conduct user testing to identify potential bugs',
    create_date: '14 May, ' + currentYear,
    time: '10:51 AM',
    due_date: '25 Aug, ' + currentYear,
    assigned: {
      name: 'Victoria Sullivan',
      avatar: 'assets/images/users/avatar-3.jpg',
    },
    status: 'Pending',
    priority: 'Low',
    checked: true,
  },
  {
    task_name: 'Gather feedback from stakeholders regarding any issues',
    create_date: '12 April, ' + currentYear,
    time: '12:09 PM',
    due_date: '28 April, ' + currentYear,
    assigned: {
      name: 'Liam Martinez',
      avatar: 'assets/images/users/avatar-4.jpg',
    },
    status: 'In-progress',
    priority: 'High',
    checked: false,
  },
  {
    task_name: 'Prioritize bugs based on severity and impact',
    create_date: '10 April, ' + currentYear,
    time: '10:09 PM',
    due_date: '15 April, ' + currentYear,
    assigned: {
      name: 'Emma Johnson',
      avatar: 'assets/images/users/avatar-5.jpg',
    },
    status: 'Completed',
    priority: 'Medium',
    checked: false,
  },
  {
    task_name: 'Investigate and analyze the root cause of each bug',
    create_date: '22 May, ' + currentYear,
    time: '03:41 PM',
    due_date: '05 July, ' + currentYear,
    assigned: {
      name: 'Olivia Thompson',
      avatar: 'assets/images/users/avatar-1.jpg',
    },
    status: 'Pending',
    priority: 'Low',
    checked: false,
  },
  {
    task_name: 'Develop and implement fixes for the identified bugs',
    create_date: '18 May, ' + currentYear,
    time: '09:09 AM',
    due_date: '30 April, ' + currentYear,
    assigned: {
      name: 'Noah Garcia',
      avatar: 'assets/images/users/avatar-6.jpg',
    },
    status: 'Completed',
    priority: 'Low',
    checked: false,
  },
  {
    task_name: 'Complete any recurring tasks',
    create_date: '05 April, ' + currentYear,
    time: '08:50 AM',
    due_date: '22 April, ' + currentYear,
    assigned: {
      name: 'Sophia Davis',
      avatar: 'assets/images/users/avatar-7.jpg',
    },
    status: 'New',
    priority: 'High',
    checked: false,
  },
  {
    task_name: 'Check emails and respond',
    create_date: '15 Jun, ' + currentYear,
    time: '11:09 PM',
    due_date: '01 Aug, ' + currentYear,
    assigned: {
      name: 'Isabella Lopez',
      avatar: 'assets/images/users/avatar-8.jpg',
    },
    status: 'Pending',
    priority: 'Low',
    checked: false,
  },
  {
    task_name: 'Review schedule for the day',
    create_date: '22 April, ' + currentYear,
    time: '05:09 PM',
    due_date: '30 April, ' + currentYear,
    assigned: {
      name: 'Ava Wilson',
      avatar: 'assets/images/users/avatar-9.jpg',
    },
    status: 'In-progress',
    priority: 'Medium',
    checked: true,
  },
  {
    task_name: 'Daily stand-up meeting',
    create_date: '23 April, ' + currentYear,
    time: '12:09 PM',
    due_date: '30 April, ' + currentYear,
    assigned: {
      name: 'Oliver Lee',
      avatar: 'assets/images/users/avatar-10.jpg',
    },
    status: 'In-progress',
    priority: 'High',
    checked: false,
  },
]
