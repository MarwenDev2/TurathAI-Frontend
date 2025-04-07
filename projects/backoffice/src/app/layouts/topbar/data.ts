import { addOrSubtractDaysFromDate } from '@/app/helper/utils'


const bitbucketImg = 'assets/images/brands/bitbucket.svg'
const dribbleImg = 'assets/images/brands/dribbble.svg'
const dropboxImg = 'assets/images/brands/dropbox.svg'
const githubImg = 'assets/images/brands/github.svg'
const slackImg = 'assets/images/brands/slack.svg'
const smImg3 = 'assets/images/small/img-3.jpg'
const smImg4 = 'assets/images/small/img-4.jpg'
const smImg6 = 'assets/images/small/img-6.jpg'
const avatar1 = 'assets/images/users/avatar-1.jpg'
const avatar3 = 'assets/images/users/avatar-3.jpg'
const avatar5 = 'assets/images/users/avatar-5.jpg'
const avatar6 = 'assets/images/users/avatar-6.jpg'
const avatar7 = 'assets/images/users/avatar-7.jpg'

export type BootstrapVariantType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'

export type FileType = Partial<File> & {
  preview?: string
}

export type ActivityType = {
  title: string
  icon?: string
  variant?: BootstrapVariantType
  status?: 'completed' | 'latest'
  files?: FileType[]
  time: Date
  type?: 'task' | 'design' | 'achievement'
  content?: string
}

export type AppType = {
  image: string
  name: string
  handle: string
}

export type NotificationType = {
  from: string
  content: string
  icon?: string
}

export const appsData: AppType[] = [
  {
    image: githubImg,
    name: 'Github',
    handle: '@reback',
  },
  {
    image: bitbucketImg,
    name: 'Bitbucket',
    handle: '@reback',
  },
  {
    image: dribbleImg,
    name: 'Dribble',
    handle: '@username',
  },
  {
    image: dropboxImg,
    name: 'Dropbox',
    handle: '@username',
  },
  {
    image: slackImg,
    name: 'Slack',
    handle: '@reback',
  },
]

export const notificationsData: NotificationType[] = [
  {
    from: 'Josephine Thompson',
    content:
      'commented on admin panel "Wow 😍! this admin looks good and awesome design"',
    icon: avatar1,
  },
  {
    from: 'Donoghue Susan',
    content: 'Hi, How are you? What about our next meeting',
  },
  {
    from: 'Jacob Gines',
    content: "Answered to your comment on the cash flow forecast's graph 🔔.",
    icon: avatar3,
  },
  {
    from: 'Shawn Bunch',
    content: 'Commented on Admin',
    icon: avatar5,
  },
  {
    from: 'Vanessa R. Davis',
    content: 'Delivery processing your order is being shipped',
  },
]

export const activityStreamData: ActivityType[] = [
  {
    title: 'Report-Fix / Update',
    variant: 'danger',
    type: 'task',
    files: [
      {
        name: 'Concept.fig',
      },
      {
        name: 'reback.docs',
      },
    ],
    time: addOrSubtractDaysFromDate(0),
  },
  {
    title: 'Project Status',
    files: [
      {
        name: 'UI/UX Figma Design.fig',
      },
    ],
    variant: 'success',
    type: 'design',
    status: 'completed',
    time: addOrSubtractDaysFromDate(1),
  },
  {
    title: 'Reback Application UI v2.0.0',
    variant: 'primary',
    content:
      'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.',
    files: [{ name: 'Backup.zip' }],
    status: 'latest',
    time: addOrSubtractDaysFromDate(3),
  },
  {
    title: 'Alex Smith Attached Photos',
    icon: avatar7,
    time: addOrSubtractDaysFromDate(4),
    files: [{ preview: smImg6 }, { preview: smImg3 }, { preview: smImg4 }],
  },
  {
    title: 'Rebecca J. added a new team member',
    icon: avatar6,
    time: addOrSubtractDaysFromDate(4),
    content: 'Added a new member to Front Dashboard',
  },
  {
    title: 'Achievements',
    variant: 'warning',
    type: 'achievement',
    time: addOrSubtractDaysFromDate(5),
    content: 'Earned a "Best Product Award"',
  },
]
