export type EventType = {
  side?: string
  title: string
  badge?: string
  description: string
}
export type TimelineType = {
  date: string
  events: EventType[]
}

export const TimelineData: TimelineType[] = [
  {
    date: 'Today',
    events: [
      {
        side: 'left',
        title: 'Completed UX design project for our client',
        badge: 'important',
        description:
          'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
      },
      {
        side: 'right',
        title: 'Yes! We are celebrating our first admin release.',
        description:
          'Consectetur adipisicing elit. Iusto, optio, dolorum John deon provident.',
      },
      {
        side: 'left',
        title: 'We released new version of our theme Larkon.',
        description: '3 new photo Uploaded on facebook fan page',
      },
    ],
  },
  {
    date: 'Yesterday',
    events: [
      {
        side: 'right',
        title: 'We have archieved 25k sales in our themes',
        description:
          'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
      },
      {
        side: 'left',
        title: 'Yes! We are celebrating our first admin release.',
        description:
          'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson.',
      },
    ],
  },
]

export const LeftTimeLine: TimelineType[] = [
  {
    date: 'Today',
    events: [
      {
        title: 'Completed UX design project for our client',
        badge: 'important',
        description:
          'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
      },
      {
        title: 'Yes! We are celebrating our first admin release.',
        description:
          'Consectetur adipisicing elit. Iusto, optio, dolorum John deon provident rerum aut hic quasi placeat iure tempora laudantium',
      },
      {
        title: 'We released new version of our theme Larkon.',
        description: '3 new photo Uploaded on facebook fan page',
      },
    ],
  },
  {
    date: 'Yesterday',
    events: [
      {
        title: 'We have archieved 25k sales in our themes',
        description:
          'Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde?',
      },
      {
        title: 'Yes! We are celebrating our first admin release.',
        description:
          'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson regarding to setup a new show room.',
      },
    ],
  },
  {
    date: '5 days ago',
    events: [
      {
        title: 'Join new team member Alex Smith',
        description:
          'Alex Smith is a Senior Software (Full Stack) engineer with a deep passion for building usable, functional & pretty web applications.',
      },
      {
        title: 'First release of Larkon admin dashboard template',
        description:
          'Outdoor visit at California State Route 85 with John Boltana & Harry Piterson regarding to setup a new show room.',
      },
    ],
  },
]
