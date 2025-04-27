import { currentYear } from '@/app/common/constants'

type UserType = {
  name: string
  image: string
}

export type ContactType = {
  image?: string
  name: string
  lastMsg: string
  time: string
  isRead: boolean
}

export type GroupType = {
  name: string
  badge?: number
}

export type UserContactType = {
  name: string
  image?: string
  status: string
}

type MediaContendType = {
  title: string
  type: string
  size: string
}

type MessageType = {
  text?: string
  img?: string[]
  isMedia?: boolean
  mediaContend?: MediaContendType
}

export type ChatMsgType = {
  id: number
  msg: MessageType[]
  timeStamp?: string
  isSender: boolean
  isRead?: boolean
}

export const UserList: UserType[] = [
  {
    name: '',
    image: 'assets/images/users/avatar-1.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-2.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-3.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-4.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-5.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-6.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-7.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-8.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-9.jpg',
  },
  {
    name: '',
    image: 'assets/images/users/avatar-10.jpg',
  },
]

export const ContactList: ContactType[] = [
  {
    image: 'assets/images/users/avatar-2.jpg',
    name: 'Gaston Lapierre',
    lastMsg: 'How are you today?',
    time: '10:20am',
    isRead: true,
  },
  {
    name: 'Fantina LeBatelier',
    time: '11:03am',
    lastMsg: "Hey! a reminder for tomorrow's meeting...",
    image: 'assets/images/users/avatar-3.jpg',
    isRead: true,
  },
  {
    name: 'Gilbert Chicoine',
    time: 'now',
    lastMsg: 'typing...',
    image: 'assets/images/users/avatar-4.jpg',
    isRead: false,
  },
  {
    name: 'Mignonette Brodeur',
    time: 'Yesterday',
    lastMsg: "Are we going to have this week's planning meeting today?",
    image: 'assets/images/users/avatar-5.jpg',
    isRead: true,
  },
  {
    name: 'Thomas Menard',
    time: 'Yesterday',
    lastMsg: 'Please check this template...',
    image: 'assets/images/users/avatar-6.jpg',
    isRead: true,
  },
  {
    name: 'Melisande Lapointe',
    time: 'Yesterday',
    lastMsg: 'Are free for 10 minutes? would like to discuss something...',
    image: 'assets/images/users/avatar-7.jpg',
    isRead: true,
  },
  {
    name: 'Danielle Despins',
    time: '7/8/21',
    lastMsg: 'How are you?',
    image: 'assets/images/users/avatar-8.jpg',
    isRead: true,
  },
  {
    name: 'Onfroi Pichette',
    time: '7/8/21',
    lastMsg: 'whats going on?',
    image: 'assets/images/users/avatar-9.jpg',
    isRead: true,
  },
  {
    name: 'Kari Boisvert',
    time: '7/8/21',
    lastMsg: 'Would you like to join us?',
    image: 'assets/images/users/avatar-10.jpg',
    isRead: false,
  },
]

export const GroupList: GroupType[] = [
  {
    name: 'General',
  },
  {
    name: 'Company',
    badge: 33,
  },
  {
    name: 'Life Suckers',
    badge: 17,
  },
  {
    name: 'Drama Club',
  },
  {
    name: 'Unknown Friends',
  },
  {
    name: 'Family Ties',
    badge: 65,
  },
  {
    name: '2Good4U',
  },
]

export const UserContact: UserContactType[] = [
  {
    name: 'Gaston Lapierre',
    image: 'assets/images/users/avatar-2.jpg',
    status: '',
  },
  {
    name: 'Fantina LeBatelier',
    image: 'assets/images/users/avatar-3.jpg',
    status: '** no status **',
  },
  {
    name: 'Gilbert Chicoine',
    image: 'assets/images/users/avatar-4.jpg',
    status: '|| Karma ||',
  },
  {
    name: 'Mignonette Brodeur',
    image: 'assets/images/users/avatar-5.jpg',
    status: 'Hey there! I am using Chat.',
  },
  {
    name: 'Thomas Menard',
    image: 'assets/images/users/avatar-6.jpg',
    status: 'TM',
  },
  {
    name: 'Melisande Lapointe',
    image: 'assets/images/users/avatar-7.jpg',
    status: 'Available',
  },
  {
    name: 'Danielle Despins',
    image: 'assets/images/users/avatar-8.jpg',
    status: 'Hey there! I am using Chat.',
  },
]

export const MessageData: ChatMsgType[] = [
  {
    id: 1,
    msg: [{ text: 'Hey 😊' }],
    timeStamp: '8:20 am',
    isSender: false,
  },
  {
    id: 2,
    msg: [{ text: 'Hi' }],
    timeStamp: '8:20 am',
    isSender: true,
    isRead: true,
  },
  {
    id: 3,
    msg: [
      {
        text: "Hi Gaston, thanks for joining the meeting. Let's dive into our quarterly performance review.",
      },
    ],
    isSender: false,
  },
  {
    id: 4,
    msg: [
      {
        text: `Hi Gilbert, thanks for having me. I'm ready to discuss how things have been going.`,
      },
    ],
    timeStamp: '8:25 am',
    isSender: true,
    isRead: true,
  },
  {
    id: 5,
    msg: [
      {
        img: [
          'assets/images/small/img-1.jpg',
          'assets/images/small/img-2.jpg',
          'assets/images/small/img-3.jpg',
        ],
      },
    ],
    timeStamp: '8:26 am',
    isSender: false,
  },
  {
    id: 6,
    msg: [
      {
        text: 'I appreciate your honesty. Can you elaborate on some of those challenges? I want to understand how we can support you better in the future.',
      },
    ],
    timeStamp: '8:27 am',
    isSender: true,
    isRead: true,
  },
  {
    id: 7,
    msg: [
      {
        text: `Thanks, Emily. I appreciate your support. Overall, I'm optimistic about our team's performance and looking forward to tackling new challenges in the next quarter.`,
      },
    ],
    timeStamp: '8:29 am',
    isSender: false,
  },
]
