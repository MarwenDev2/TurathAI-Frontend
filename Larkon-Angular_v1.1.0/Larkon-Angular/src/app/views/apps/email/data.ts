export type EmailType = {
  id: string
  sender: string
  subject: string
  message: string
  date: string
  status: string
  isStarred: boolean
  isImportant: boolean
  isSent: boolean
  isTrash: boolean
  attachType?: string
  attachments?: string[]
  badge?: string
  type: string
}

export const emailData: EmailType[] = [
  {
    id: 'InboxChk1',
    sender: 'Daniel J. Olsen',
    subject:
      'Lucas Kriebel (@Daniel J. Olsen) has sent you a direct message on Twitter!',
    message:
      '@Daniel J. Olsen - Very cool :) Nicklas, You have a new direct message.',
    date: '11:49 am',
    status: 'unread',
    isStarred: false,
    isImportant: true,
    isSent: false,
    isTrash: false,
    type: 'social',
  },
  {
    id: 'InboxChk2',
    sender: 'Jack P. Roldan',
    subject: 'Images',
    message: '',
    attachType: 'image',
    attachments: ['IMG_201', 'IMG_202', 'IMG_203'],
    badge: '+5',
    date: 'Feb 21',
    status: 'read',
    isStarred: true,
    isImportant: true,
    isSent: true,
    isTrash: true,
    type: 'promotions',
  },
  {
    id: 'InboxChk3',
    sender: 'Betty C. Cox (11)',
    subject: 'Train/Bus',
    message:
      "Yes ok, great! I'm not stuck in Stockholm anymore, we're making progress.",
    date: 'Feb 19',
    status: 'read',
    isStarred: false,
    isImportant: false,
    isSent: false,
    isTrash: false,
    type: 'updates',
  },
  {
    id: 'InboxChk4',
    sender: 'Medium',
    subject: "This Week's Top Stories",
    message:
      "Our top pick for you on Medium this week The Man Who Destroyed America's Ego",
    date: 'Feb 28',
    status: 'unread',
    isStarred: false,
    isImportant: false,
    isSent: true,
    isTrash: true,
    type: 'forums',
  },
  {
    id: 'InboxChk5',
    sender: 'Death to Stock',
    subject: '(no subject)',
    message: '',
    attachType: 'pdf',
    attachments: ['dashboard.pdf', 'pages-data.pdf'],
    date: 'Feb 28',
    status: 'read',
    isStarred: true,
    isImportant: false,
    isSent: false,
    isTrash: false,
    type: 'social',
  },
  {
    id: 'InboxChk6',
    sender: 'Revibe',
    subject: '(no subject)',
    message: '',
    attachType: 'doc',
    attachments: ['doc1.doc', 'doc2.doc', 'doc3.doc', 'doc4.doc'],
    date: 'Feb 27',
    status: 'read',
    isStarred: false,
    isImportant: true,
    isSent: false,
    isTrash: true,
    type: 'promotions',
  },
  {
    id: 'InboxChk7',
    sender: 'Erik, me (5)',
    subject: 'Regarding our meeting',
    message: "That's great, see you on Thursday!",
    date: 'Feb 24',
    status: 'read',
    isStarred: true,
    isImportant: false,
    isSent: true,
    isTrash: false,
    type: 'social',
  },
  {
    id: 'InboxChk8',
    sender: 'KanbanFlow',
    subject: "Task assigned: Clone ARP's website",
    message: 'You have been assigned a task by Alex@Work on the board Web.',
    date: 'Feb 24',
    status: 'read',
    isStarred: true,
    isImportant: false,
    isSent: true,
    isTrash: false,
    type: 'updates',
  },
  {
    id: 'InboxChk9',
    sender: 'Tobias Berggren',
    subject: "Let's go fishing!",
    message:
      "Hey, You wanna join me and Fred at the lake tomorrow? It'll be awesome.",
    date: 'Feb 23',
    status: 'read',
    isStarred: false,
    isImportant: true,
    isSent: true,
    isTrash: false,
    type: 'updates',
  },
  {
    id: 'InboxChk10',
    sender: 'Charukaw, me (7)',
    subject: 'Hey man',
    message: "Nah man sorry i don't. Should i get it?",
    date: 'Feb 23',
    status: 'read',
    isStarred: true,
    isImportant: true,
    isSent: true,
    isTrash: false,
    type: 'forums',
  },
  {
    id: 'InboxChk11',
    sender: 'Stack Exchange',
    subject: '1 new items in your Stackexchange inbox',
    message:
      'The following items were added to your Stack Exchange global inbox since you last checked it.',
    date: 'Feb 21',
    status: 'read',
    isStarred: true,
    isImportant: false,
    isSent: true,
    isTrash: true,
    type: 'social',
  },
  {
    id: 'InboxChk12',
    sender: 'Google Drive Team',
    subject: 'You can now use your storage in Google Drive',
    message:
      'Hey Nicklas Sandell! Thank you for purchasing extra storage space in Google Drive.',
    date: 'Feb 20',
    status: 'read',
    isStarred: true,
    isImportant: false,
    isSent: false,
    isTrash: true,
    type: 'promotions',
  },
  {
    id: 'InboxChk13',
    sender: 'Peter, me (3)',
    subject: 'Hello',
    message:
      'Trip home from Colombo has been arranged, then Jenna will come get me from Stockholm. :)',
    date: 'Mar 6',
    status: 'read',
    isStarred: false,
    isImportant: true,
    isSent: true,
    isTrash: true,
    type: 'updates',
  },
  {
    id: 'InboxChk14',
    sender: 'me, Susanna (7)',
    subject:
      "Since you asked... and i'm inconceivably bored at the train station",
    message:
      "Alright thanks. I'll have to re-book that somehow, i'll get back to you.",
    date: 'Mar 6',
    status: 'read',
    isStarred: false,
    isImportant: false,
    isSent: false,
    isTrash: true,
    type: 'forums',
  },
]
