type CustomerType = {
  avatar: string;
  name: string;
  invoice: string;
  status: string;
  amountPaid: number;
  amountDue: number;
  date: string;
  paymentMethod: string;
};

export const customerData: CustomerType[] = [
  {
    avatar: 'assets/images/users/avatar-2.jpg',
    name: 'Michael A. Miner',
    invoice: '#INV2540',
    status: 'Completed',
    amountPaid: 4521,
    amountDue: 8901,
    date: '07 Jan, 2023',
    paymentMethod: 'Mastercard',
  },
  {
    avatar: 'assets/images/users/avatar-3.jpg',
    name: 'Theresa T. Brose',
    invoice: '#INV3924',
    status: 'Cancel',
    amountPaid: 7836,
    amountDue: 9902,
    date: '03 Dec, 2023',
    paymentMethod: 'Visa',
  },
  {
    avatar: 'assets/images/users/avatar-4.jpg',
    name: 'James L. Erickson',
    invoice: '#INV5032',
    status: 'Completed',
    amountPaid: 1347,
    amountDue: 6718,
    date: '28 Sep, 2023',
    paymentMethod: 'Paypal',
  },
  {
    avatar: 'assets/images/users/avatar-5.jpg',
    name: 'Lily W. Wilson',
    invoice: '#INV1695',
    status: 'Pending',
    amountPaid: 9457,
    amountDue: 3928,
    date: '10 Aug, 2023',
    paymentMethod: 'Mastercard',
  },
  {
    avatar: 'assets/images/users/avatar-6.jpg',
    name: 'Sarah M. Brooks',
    invoice: '#INV8473',
    status: 'Cancel',
    amountPaid: 4214,
    amountDue: 9814,
    date: '22 May, 2023',
    paymentMethod: 'Visa',
  },
  {
    avatar: 'assets/images/users/avatar-7.jpg',
    name: 'Joe K. Hall',
    invoice: '#INV2150',
    status: 'Completed',
    amountPaid: 2513,
    amountDue: 5891,
    date: '15 Mar, 2023',
    paymentMethod: 'Paypal',
  },
  {
    avatar: 'assets/images/users/avatar-8.jpg',
    name: 'Ralph Hueber',
    invoice: '#INV5636',
    status: 'Completed',
    amountPaid: 3103,
    amountDue: 8415,
    date: '15 Mar, 2023',
    paymentMethod: 'Visa',
  },
  {
    avatar: 'assets/images/users/avatar-9.jpg',
    name: 'Sarah Drescher',
    invoice: '#INV2940',
    status: 'Completed',
    amountPaid: 2416,
    amountDue: 7715,
    date: '15 Mar, 2023',
    paymentMethod: 'Mastercard',
  },
  {
    avatar: 'assets/images/users/avatar-10.jpg',
    name: 'Leonie Meister',
    invoice: '#INV9027',
    status: 'Pending',
    amountPaid: 1367,
    amountDue: 3651,
    date: '15 Mar, 2023',
    paymentMethod: 'Paypal',
  },
];
