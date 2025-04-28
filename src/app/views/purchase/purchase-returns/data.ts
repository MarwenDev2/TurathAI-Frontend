import type { StateType } from '@component/state-card/state-card.component'

type CustomerType = {
  avatar: string;
  name: string;
};
type PurchaseReturnType = {
  invoice: string;
  customer: CustomerType;
  items: string;
  date: string;
  amount: number;
  status: string;
};


export const PurchaseReturnList: PurchaseReturnType[] = [
  {
    invoice: '#INV2540',
    customer: {
      name: 'Michael A. Miner',
      avatar: 'assets/images/users/avatar-2.jpg',
    },
    items: 'T-shirt , Wallet',
    date: '07 Jan, 2023',
    amount: 289.00,
    status: 'Completed',
  },
  {
    invoice: '#INV3924',
    customer: {
      name: 'Theresa T. Brose',
      avatar: 'assets/images/users/avatar-3.jpg',
    },
    items: 'Golden Dress , Sunglass',
    date: '03 Dec, 2023',
    amount: 213.00,
    status: 'Completed',
  },
  {
    invoice: '#INV5032',
    customer: {
      name: 'James L. Erickson',
      avatar: 'assets/images/users/avatar-4.jpg',
    },
    items: 'Shoes , Cargo Pent',
    date: '28 Sep, 2023',
    amount: 735.00,
    status: 'Completed',
  },
  {
    invoice: '#INV1695',
    customer: {
      name: 'Lily W. Wilson',
      avatar: 'assets/images/users/avatar-5.jpg',
    },
    items: 'Watch , T-shirt',
    date: '10 Aug, 2023',
    amount: 324.00,
    status: 'Pending',
  },
  {
    invoice: '#INV8473',
    customer: {
      name: 'Sarah M. Brooks',
      avatar: 'assets/images/users/avatar-6.jpg',
    },
    items: 'Hand Bag , Watch',
    date: '22 May, 2023',
    amount: 153.00,
    status: 'Completed',
  },
  {
    invoice: '#INV2150',
    customer: {
      name: 'Joe K. Hall',
      avatar: 'assets/images/users/avatar-7.jpg',
    },
    items: 'Headphone , Dress',
    date: '15 Mar, 2023',
    amount: 424.00,
    status: 'Pending',
  },
  {
    invoice: '#INV5636',
    customer: {
      name: 'Ralph Hueber',
      avatar: 'assets/images/users/avatar-8.jpg',
    },
    items: 'Headphone',
    date: '19 Dec, 2023',
    amount: 521.00,
    status: 'Pending',
  },
  {
    invoice: '#INV2940',
    customer: {
      name: 'Sarah Drescher',
      avatar: 'assets/images/users/avatar-9.jpg',
    },
    items: 'Cap , Sunglass , Hand Bag',
    date: '11 Jun, 2023',
    amount: 313.00,
    status: 'Completed',
  },
  {
    invoice: '#INV9027',
    customer: {
      name: 'Leonie Meister',
      avatar: 'assets/images/users/avatar-10.jpg',
    },
    items: 'Headphone , T-shirt',
    date: '19 Mar, 2023',
    amount: 219.00,
    status: 'Completed',
  },
];
