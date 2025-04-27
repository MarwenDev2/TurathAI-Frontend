type AuthorType = {
  name: string;
  photo: string;
};

type HelpType = {
  title: string;
  description: string;
  icon: string;
  author: AuthorType;
  videos: number;
};

export const HelpList: HelpType[] = [
  {
    title: 'Getting Started with Larkon',
    description:
      'Welcome to Larkon Dive into basic for a swift on boarding experience',
    icon: 'solar:round-arrow-right-bold',
    author: {
      name: 'Aston Martin',
      photo: 'assets/images/users/avatar-1.jpg',
    },
    videos: 19,
  },
  {
    title: 'Admin Settings',
    description:
      'Learn how to manage your current workspace or your enterprise space',
    icon: 'solar:user-circle-bold',
    author: {
      name: 'Michael A. Miner',
      photo: 'assets/images/users/avatar-2.jpg',
    },
    videos: 10,
  },
  {
    title: 'Server Setup',
    description:
      'Connect, simplify, and automate. Discover the power of apps and tools.',
    icon: 'solar:display-bold',
    author: {
      name: 'Theresa T. Brose',
      photo: 'assets/images/users/avatar-3.jpg',
    },
    videos: 7,
  },
  {
    title: 'Login And Verification',
    description:
      'Read on to learn how to sign in with your email address, or your Apple or Google.',
    icon: 'solar:login-3-bold',
    author: {
      name: 'James L. Erickson',
      photo: 'assets/images/users/avatar-4.jpg',
    },
    videos: 3,
  },
  {
    title: 'Account Setup',
    description:
      'Adjust your profile and preferences to make ChatCloud work just for you',
    icon: 'solar:shield-user-bold',
    author: {
      name: 'Lily Wilson',
      photo: 'assets/images/users/avatar-5.jpg',
    },
    videos: 11,
  },
  {
    title: 'Trust & Safety',
    description:
      'Trust on our current database and learn how we distribute your data.',
    icon: 'solar:hand-shake-bold',
    author: {
      name: 'Sarah Brooks',
      photo: 'assets/images/users/avatar-6.jpg',
    },
    videos: 9,
  },
  {
    title: 'Channel Setup',
    description:
      'From channels to search, learn how ChatCloud works from top to bottom.',
    icon: 'solar:settings-bold',
    author: {
      name: 'Joe K. Hall',
      photo: 'assets/images/users/avatar-7.jpg',
    },
    videos: 14,
  },
  {
    title: 'Permissions',
    description:
      'Permission for you and others to join and work within a workspace',
    icon: 'solar:lock-keyhole-minimalistic-bold',
    author: {
      name: 'Robert Leavitt',
      photo: 'assets/images/users/avatar-8.jpg',
    },
    videos: 17,
  },
  {
    title: 'Billing Help',
    description:
      'That feel when you look at your bank account and billing works.',
    icon: 'solar:lock-keyhole-minimalistic-bold',
    author: {
      name: 'Lydia Anderson',
      photo: 'assets/images/users/avatar-9.jpg',
    },
    videos: 12,
  },
];
