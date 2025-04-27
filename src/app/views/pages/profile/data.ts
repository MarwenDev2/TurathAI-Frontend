type ReviewType = {
  avatar:string
  name:string
  role:string
  date:string
  tags:string[]
  title:string
  description:string
}

export const ReviewData:ReviewType[] = [
  {
    avatar: 'assets/images/users/avatar-1.jpg',
    name: 'Gaston Lapierre',
    role: 'Project Head Manager',
    date: 'Nov 16',
    tags: ['#inbound', '#SaaS'],
    title:
      'Do you have any experience with deploying @Hubspot for a SaaS business with both a direct and self-serve model?',
    description:
      'We are a Series A B2B startup offering a custom solution. Currently, we are utilizing @MixPanel and collaborating with @Division of Labor to rebuild our pages. Shoutout to @Jennifer Smith for her support...',
  },
  {
    avatar: 'assets/images/users/avatar-1.jpg',
    name: 'Gaston Lapierre',
    role: 'Project Head Manager',
    date: 'Nov 11',
    tags: ['#LatAm', '#Europe'],
    title: 'Looking for a new landing page optimization vendor',
    description:
      'We are currently using @Optimizely, but find that they are missing a number with a custom solution that no... ',
  },
  {
    avatar: 'assets/images/users/avatar-1.jpg',
    name: 'Gaston Lapierre',
    role: 'Project Head Manager',
    date: 'Nov 08',
    tags: ['#Performance-marketing', '#CRM'],
    title: 'Why Your Company Needs a CRM to Grow Better?',
    description:
      'CRMs are powerful tools that help you expedite business growth while number with a custom eliminating friction, improving cross-team collaboration, managing your contact records, syncing...',
  },
];
