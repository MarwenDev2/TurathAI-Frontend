import type { StateType } from '@component/state-card/state-card.component'

type PermissionType = {
  task: string;
  roles: string[];
  date: string;
  due_date: string;
};

export const permissionState:StateType[] = [
  {
    title: 'Employees',
    value: 54,
    icon: 'solar:users-group-two-rounded-bold-duotone',
  },
  {
    title: 'Assigned Manager',
    value: 13,
    icon: 'solar:backpack-bold-duotone',
  },
  {
    title: 'Project',
    value: 19,
    icon: 'solar:rocket-2-bold-duotone',
  },
  {
    title: 'License Used',
    value: 36/50,
    icon: 'solar:notebook-bold-duotone',
  }
];

export const permissionData: PermissionType[] = [
  {
    task: 'User Management',
    roles: ['Manager'],
    date: '4 Mar 2023, 08:30 am',
    due_date: 'Today',
  },
  {
    task: 'Financial Management',
    roles: ['Administrator', 'Developer'],
    date: '27 Jun 2024, 12:00 am',
    due_date: 'Yesterday',
  },
  {
    task: 'Content Management',
    roles: ['Manager', 'Administrator'],
    date: '02 Dec 2023, 02:30 am',
    due_date: '06 Dec 2023',
  },
  {
    task: 'Payroll',
    roles: ['Manager', 'Administrator', 'Analyst', 'Trial'],
    date: '27 Jun 2024, 12:00 am',
    due_date: '14 May 2024',
  },
  {
    task: 'Reporting',
    roles: ['Manager', 'Trial', 'Developer'],
    date: '13 Aug 2024, 07:05 am',
    due_date: 'Today',
  },
  {
    task: 'API Controls',
    roles: ['Manager', 'Analyst'],
    date: '28 Sep 2023, 01:20 pm',
    due_date: '10 Oct 2023',
  },
  {
    task: 'Disputes Management',
    roles: ['Manager', 'Developer'],
    date: '10 Feb 2025, 06:00 pm',
    due_date: 'Yesterday',
  },
  {
    task: 'Database Management',
    roles: ['Manager', 'Administrator', 'Developer'],
    date: '19 Jul 2024, 09:45 pm',
    due_date: 'Yesterday',
  },
  {
    task: 'Repository Management',
    roles: ['Administrator', 'Developer'],
    date: '05 Jan 2024, 11:00 am',
    due_date: '03 Dec 2023',
  },
];
