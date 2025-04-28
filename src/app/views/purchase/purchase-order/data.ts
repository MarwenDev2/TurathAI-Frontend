import type { StateType } from '@component/state-card/state-card.component';

type PurchaseOrderType = {
  customer_name: string;
  email: string;
  date: string;
  total: number;
  status: string;
};

export const purchaseState: StateType[] = [
  {
    title: 'Total Orders',
    value: 472,
    badge: 6.9,
    icon: 'solar:box-broken',
    badgeColor: 'danger',
  },
  {
    title: 'Order Items Over Time',
    value: 231,
    badge: 13.2,
    icon: 'solar:sort-by-time-broken',
    badgeColor: 'success',
  },
  {
    title: 'Return Order',
    value: 367,
    badge: 2.1,
    icon: 'solar:bag-cross-broken',
    badgeColor: 'success',
  },
  {
    title: 'Fulfilled Orders Over Time',
    value: 123,
    badge: 3.1,
    icon: 'solar:bag-smile-broken',
    badgeColor: 'danger',
  },
];

export const purchaseOrders: PurchaseOrderType[] = [
  {
    customer_name: 'Michael A. Miner',
    email: 'michaelminer@dayrep.com',
    date: '07 Jan, 2023',
    total: 289.0,
    status: 'Completed',
  },
  {
    customer_name: 'Theresa T. Brose',
    email: 'theresbrosea@dayrep.com',
    date: '03 Dec, 2023',
    total: 213.0,
    status: 'Cancel',
  },
  {
    customer_name: 'James L. Erickson',
    email: 'walterlcalabre@jourrapide.com',
    date: '28 Sep, 2023',
    total: 735.0,
    status: 'Completed',
  },
  {
    customer_name: 'Lily W. Wilson',
    email: 'olivehmize@rhyta.com',
    date: '10 Aug, 2023',
    total: 324.0,
    status: 'Pending',
  },
  {
    customer_name: 'Sarah M. Brooks',
    email: 'christasardina@dayrep.com',
    date: '22 May, 2023',
    total: 153.0,
    status: 'Completed',
  },
  {
    customer_name: 'Joe K. Hall',
    email: 'darrenwrivera@dayrep.com',
    date: '15 Mar, 2023',
    total: 424.0,
    status: 'Cancel',
  },
  {
    customer_name: 'Ralph Hueber',
    email: 'robertvleavitt@dayrep.com',
    date: '19 Dec, 2023',
    total: 521.0,
    status: 'Pending',
  },
  {
    customer_name: 'Sarah Drescher',
    email: 'lydiajanderson@dayrep.com',
    date: '11 Jun, 2023',
    total: 313.0,
    status: 'Completed',
  },
  {
    customer_name: 'Leonie Meister',
    email: 'leonie@dayrep.com',
    date: '19 Mar, 2023',
    total: 219.0,
    status: 'Cancel',
  },
];
