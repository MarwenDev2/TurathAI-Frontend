import type { StateType } from '@component/state-card/state-card.component'

type ReceivedOrderType = {
  order_id: string;
  name: string;
  quantity: number;
  price: number;
  payment_status: string;
  delivery_status: string;
};

export const orderState:StateType[] = [
  {
    title: 'Pending Review',
    value: 210,
    icon: 'solar:clipboard-remove-broken',
  },
  {
    title: 'Pending Payment',
    value: 608,
    icon: 'solar:clock-circle-broken',
  },
  {
    title: 'Delivered',
    value: 200,
    icon: 'solar:clipboard-check-broken',
  },
  {
    title: 'In Progress',
    value: 656,
    icon: 'solar:inbox-line-broken',
  },
];
export const ReceivedOrderData: ReceivedOrderType[] = [
  {
    order_id: '#583488/80',
    name: 'Michael A. Miner',
    quantity: 3,
    price: 289.0,
    payment_status: 'Paid',
    delivery_status: 'Delivered',
  },
  {
    order_id: '#456754/80',
    name: 'Theresa T. Brose',
    quantity: 5,
    price: 213.0,
    payment_status: 'COD',
    delivery_status: 'Failed',
  },
  {
    order_id: '#578246/80',
    name: 'Cecile D. Gordon',
    quantity: 3,
    price: 735.0,
    payment_status: 'Paid',
    delivery_status: 'Delivered',
  },
  {
    order_id: '#348930/80',
    name: 'William Moreno',
    quantity: 2,
    price: 324.0,
    payment_status: 'COD',
    delivery_status: 'Pending',
  },
  {
    order_id: '#391367/80',
    name: 'Sarah M. Brooks',
    quantity: 7,
    price: 153.0,
    payment_status: 'COD',
    delivery_status: 'Delivered',
  },
  {
    order_id: '#930447/80',
    name: 'Joe K. Hall',
    quantity: 2,
    price: 424.0,
    payment_status: 'Paid',
    delivery_status: 'Failed',
  },
  {
    order_id: '#462397/80',
    name: 'Ralph Hueber',
    quantity: 1,
    price: 521.0,
    payment_status: 'Paid',
    delivery_status: 'Pending',
  },
  {
    order_id: '#472356/80',
    name: 'Sarah Drescher',
    quantity: 4,
    price: 313.0,
    payment_status: 'COD',
    delivery_status: 'Delivered',
  },
  {
    order_id: '#448226/80',
    name: 'Leonie Meister',
    quantity: 6,
    price: 219.0,
    payment_status: 'COD',
    delivery_status: 'Failed',
  },
];
