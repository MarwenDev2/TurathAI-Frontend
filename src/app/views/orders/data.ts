import type { StateType } from '@component/state-card/state-card.component'

type OrderType = {
  id: string;
  date: string;
  name: string;
  priority: string;
  amount: number;
  payment_status: string;
  quantity: number;
  tracking_number: string;
  order_status: string;
};

export type CartType = {
  image: string;
  title: string;
  color: string;
  size: string;
  quantity: number;
  item_price: number;
  tax: number;
  total: number;
};


export const StatusData:StateType[] = [ 
  {
    title:'Payment Refund',
    icon:'solar:chat-round-money-broken',
    value:490
  },
  {
    title:'Order Cancel',
    icon:'solar:cart-cross-broken',
    value:241
  },
  {
    title:'Order Shipped',
    icon:'solar:box-broken',
    value:630
  },
  {
    title:'Order Delivering',
    icon:'solar:tram-broken',
    value:170
  },
  {
    title:'Pending Review',
    icon:'solar:clipboard-remove-broken',
    value:210
  },
  {
    title:'Pending Payment',
    icon:'solar:clock-circle-broken',
    value:608
  },
  {
    title:'Delivered',
    icon:'solar:clipboard-check-broken',
    value:200
  },
  {
    title:'In Progress',
    icon:'solar:inbox-line-broken',
    value:656
  }
]

export const OrderList: OrderType[] = [
  {
    id: '#583488/80',
    date: 'Apr 23, 2024',
    name: 'Gail C. Anderson',
    priority: 'Normal',
    amount: 1230,
    payment_status: 'Unpaid',
    quantity: 4,
    tracking_number: '-',
    order_status: 'Draft',
  },
  {
    id: '#456754/80',
    date: 'Apr 20, 2024',
    name: 'Jung S. Ayala',
    priority: 'Normal',
    amount: 987,
    payment_status: 'Paid',
    quantity: 2,
    tracking_number: '-',
    order_status: 'Packaging',
  },
  {
    id: '#578246/80',
    date: 'Apr 19, 2024',
    name: 'David A. Arnold',
    priority: 'High',
    amount: 1478,
    payment_status: 'Paid',
    quantity: 5,
    tracking_number: '#D-57837678',
    order_status: 'Completed',
  },
  {
    id: '#348930/80',
    date: 'Apr 04, 2024',
    name: 'Cecile D. Gordon',
    priority: 'Normal',
    amount: 720,
    payment_status: 'Refund',
    quantity: 4,
    tracking_number: '-',
    order_status: 'Canceled',
  },
  {
    id: '#391367/80',
    date: 'Apr 02, 2024',
    name: 'William Moreno',
    priority: 'Normal',
    amount: 1909,
    payment_status: 'Paid',
    quantity: 6,
    tracking_number: '#D-89734235',
    order_status: 'Completed',
  },
  {
    id: '#930447/80',
    date: 'March 28, 2024',
    name: 'Alphonse Roy',
    priority: 'High',
    amount: 879,
    payment_status: 'Paid',
    quantity: 4,
    tracking_number: '#D-35227268',
    order_status: 'Completed',
  },
  {
    id: '#462397/80',
    date: 'March 20, 2024',
    name: 'Pierpont Marleau',
    priority: 'High',
    amount: 1230,
    payment_status: 'Refund',
    quantity: 2,
    tracking_number: '-',
    order_status: 'Canceled',
  },
  {
    id: '#472356/80',
    date: 'March 12, 2024',
    name: 'Madeleine Gervais',
    priority: 'Normal',
    amount: 1264,
    payment_status: 'Paid',
    quantity: 3,
    tracking_number: '#D-74922656',
    order_status: 'Completed',
  },
  {
    id: '#448226/80',
    date: 'March 02, 2024',
    name: 'Satordi Gaillou',
    priority: 'High',
    amount: 1787,
    payment_status: 'Paid',
    quantity: 4,
    tracking_number: '-',
    order_status: 'Packaging',
  },
];

export const cartData: CartType[] = [
  {
    image: 'assets/images/product/p-1.png',
    title: 'Men Black Slim Fit T-shirt',
    color: 'Dark',
    size: 'M',
    quantity: 1,
    item_price: 80.0,
    tax: 3.0,
    total: 83.0,
  },
  {
    image: 'assets/images/product/p-5.png',
    title: 'Dark Green Cargo Pent',
    color: 'Dark Green',
    size: 'M',
    quantity: 3,
    item_price: 330.0,
    tax: 4.0,
    total: 334.0,
  },
  {
    image: 'assets/images/product/p-8.png',
    title: 'Men Dark Brown Wallet',
    color: 'Brown',
    size: 'S',
    quantity: 1,
    item_price: 132.0,
    tax: 5.0,
    total: 137.0,
  },
  {
    image: 'assets/images/product/p-10.png',
    title: "Kid's Yellow T-shirt",
    color: 'Yellow',
    size: 'S',
    quantity: 2,
    item_price: 220.0,
    tax: 3.0,
    total: 223.0,
  },
];

