import type { StateType } from '@component/state-card/state-card.component';

type CustomerType = {
  image: string;
  name: string;
};

type InvoiceType = {
  invoice: string;
  customer: CustomerType;
  date: string;
  amount: number;
  method: string;
  status: string;
};

export const invoiceState: StateType[] = [
  {
    title: 'Total Invoice',
    value: 2310,
    icon: 'solar:bill-list-bold-duotone',
  },
  {
    title: 'Pending Invoice',
    value: 1000,
    icon: 'solar:bill-cross-bold-duotone',
  },
  {
    title: 'Paid Invoice',
    value: 1310,
    icon: 'solar:bill-check-bold-duotone',
  },
  {
    title: 'Inactive Invoice',
    value: 1243,
    icon: 'solar:bill-bold-duotone',
  },
];

export const InvoiceData: InvoiceType[] = [
  {
    invoice: '#INV2540',
    customer: {
      name: 'Michael A. Miner',
      image: 'assets/images/users/avatar-2.jpg',
    },
    date: '07 Jan, 2023',
    amount: 452,
    method: 'Mastercard',
    status: 'Completed',
  },
  {
    invoice: '#INV3924',
    customer: {
      name: 'Theresa T. Brose',
      image: 'assets/images/users/avatar-3.jpg',
    },
    date: '03 Dec, 2023',
    amount: 783,
    method: 'Visa',
    status: 'Cancel',
  },
  {
    invoice: '#INV5032',
    customer: {
      name: 'James L. Erickson',
      image: 'assets/images/users/avatar-4.jpg',
    },
    date: '28 Sep, 2023',
    amount: 134,
    method: 'Paypal',
    status: 'Completed',
  },
  {
    invoice: '#INV1695',
    customer: {
      name: 'Lily W. Wilson',
      image: 'assets/images/users/avatar-5.jpg',
    },
    date: '10 Aug, 2023',
    amount: 945,
    method: 'Mastercard',
    status: 'Pending',
  },
  {
    invoice: '#INV8473',
    customer: {
      name: 'Sarah M. Brooks',
      image: 'assets/images/users/avatar-6.jpg',
    },
    date: '22 May, 2023',
    amount: 421,
    method: 'Visa',
    status: 'Cancel',
  },
  {
    invoice: '#INV2150',
    customer: {
      name: 'Joe K. Hall',
      image: 'assets/images/users/avatar-7.jpg',
    },
    date: '15 Mar, 2023',
    amount: 251,
    method: 'Paypal',
    status: 'Completed',
  },
  {
    invoice: '#INV5636',
    customer: {
      name: 'Ralph Hueber',
      image: 'assets/images/users/avatar-8.jpg',
    },
    date: '15 Mar, 2023',
    amount: 310,
    method: 'Visa',
    status: 'Completed',
  },
  {
    invoice: '#INV2940',
    customer: {
      name: 'Sarah Drescher',
      image: 'assets/images/users/avatar-9.jpg',
    },
    date: '15 Mar, 2023',
    amount: 241,
    method: 'Mastercard',
    status: 'Completed',
  },
  {
    invoice: '#INV9027',
    customer: {
      name: 'Leonie Meister',
      image: 'assets/images/users/avatar-10.jpg',
    },
    date: '15 Mar, 2023',
    amount: 136,
    method: 'Paypal',
    status: 'Pending',
  },
];
