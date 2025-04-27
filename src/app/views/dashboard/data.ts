import { currency } from "@common/constants";

type StateType = {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: string;
  change_type: string;
};

type TopPageType = {
  url: string;
  views: number;
  change: string;
  status: string;
};

type orderType = {
  order_id: string;
  date: string;
  image: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  payment_method: string;
  status: string;
};

export const stateData: StateType[] = [
  {
    title: 'Total Orders',
    value: '13,647',
    change: '2.3%',
    period: 'Last Week',
    icon: 'solar:cart-5-bold-duotone',
    change_type: 'success',
  },
  {
    title: 'New Leads',
    value: '9,526',
    change: '8.1%',
    period: 'Last Month',
    icon: 'bx-award',
    change_type: 'success',
  },
  {
    title: 'Deals',
    value: '976',
    change: '0.3%',
    period: 'Last Month',
    icon: 'bxs-backpack',
    change_type: 'danger',
  },
  {
    title: 'Booked Revenue',
    value: `${currency}123.6k`,
    change: '10.6%',
    period: 'Last Month',
    icon: 'bx-dollar-circle',
    change_type: 'danger',
  },
];

export const topPages: TopPageType[] = [
  {
    url: 'larkon/ecommerce.html',
    views: 465,
    change: '4.4%',
    status: 'success',
  },
  {
    url: 'larkon/dashboard.html',
    views: 426,
    change: '20.4%',
    status: 'danger',
  },
  {
    url: 'larkon/chat.html',
    views: 254,
    change: '12.25%',
    status: 'warning',
  },
  {
    url: 'larkon/auth-login.html',
    views: 3369,
    change: '5.2%',
    status: 'success',
  },
  {
    url: 'larkon/email.html',
    views: 985,
    change: '64.2%',
    status: 'danger',
  },
  {
    url: 'larkon/social.html',
    views: 653,
    change: '2.4%',
    status: 'success',
  },
  {
    url: 'larkon/blog.html',
    views: 478,
    change: '1.4%',
    status: 'danger',
  },
];

export const orderList: orderType[] = [
  {
    order_id: '#RB5625',
    date: '29 April 2024',
    image: 'assets/images/products/product-1(1).png',
    name: 'Anna M. Hines',
    email: 'anna.hines@mail.com',
    phone: '(+1)-555-1564-261',
    location: 'Burr Ridge/Illinois',
    payment_method: 'Credit Card',
    status: 'Completed',
  },
  {
    order_id: '#RB9652',
    date: '25 April 2024',
    image: 'assets/images/products/product-4.png',
    name: 'Judith H. Fritsche',
    email: 'judith.fritsche.com',
    phone: '(+57)-305-5579-759',
    location: 'SULLIVAN/Kentucky',
    payment_method: 'Credit Card',
    status: 'Completed',
  },
  {
    order_id: '#RB5984',
    date: '25 April 2024',
    image: 'assets/images/products/product-5.png',
    name: 'Peter T. Smith',
    email: 'peter.smith@mail.com',
    phone: '(+33)-655-5187-93',
    location: 'Yreka/California',
    payment_method: 'Pay Pal',
    status: 'Completed',
  },
  {
    order_id: '#RB3625',
    date: '21 April 2024',
    image: 'assets/images/products/product-6.png',
    name: 'Emmanuel J. Delcid',
    email: 'emmanuel.delicid@mail.com',
    phone: '(+30)-693-5553-637',
    location: 'Atlanta/Georgia',
    payment_method: 'Pay Pal',
    status: 'Processing',
  },
  {
    order_id: '#RB8652',
    date: '18 April 2024',
    image: 'assets/images/products/product-1(2).png',
    name: 'William J. Cook',
    email: 'william.cook@mail.com',
    phone: '(+91)-855-5446-150',
    location: 'Rosenberg/Texas',
    payment_method: 'Credit Card',
    status: 'Processing',
  },
];
