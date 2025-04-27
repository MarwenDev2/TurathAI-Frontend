type customerType = {
  name: string;
  image: string;
};

type PurchaseListType = {
  invoice: string;
  customer: customerType;
  items: string;
  status: string;
  date: string;
  amount: number;
  payment_method: string;
  order_status: string;
};

export const purchaseData: PurchaseListType[] = [
  {
    invoice: '#INV2540',
    customer: {
      name: 'Michael A. Miner',
      image: 'assets/images/users/avatar-2.jpg',
    },
    items: 'T-shirt , Wallet',
    status: 'Items Received',
    date: '07 Jan, 2023',
    amount: 621,
    payment_method: 'Mastercard',
    order_status: 'Completed',
  },
  {
    invoice: '#INV3924',
    customer: {
      name: 'Theresa T. Brose',
      image: 'assets/images/users/avatar-3.jpg',
    },
    items: 'Golden Dress , Sunglass',
    status: 'Items Received',
    date: '03 Dec, 2023',
    amount: 502,
    payment_method: 'Visa',
    order_status: 'Cancel',
  },
  {
    invoice: '#INV5032',
    customer: {
      name: 'James L. Erickson',
      image: 'assets/images/users/avatar-4.jpg',
    },
    items: 'Shoes , Cargo Pent',
    status: 'Items Received',
    date: '28 Sep, 2023',
    amount: 218,
    payment_method: 'Paypal',
    order_status: 'Completed',
  },
  {
    invoice: '#INV1695',
    customer: {
      name: 'Lily W. Wilson',
      image: 'assets/images/users/avatar-5.jpg',
    },
    items: 'Watch , T-shirt',
    status: 'Items Received',
    date: '10 Aug, 2023',
    amount: 428,
    payment_method: 'Mastercard',
    order_status: 'Pending',
  },
  {
    invoice: '#INV8473',
    customer: {
      name: 'Sarah M. Brooks',
      image: 'assets/images/users/avatar-6.jpg',
    },
    items: 'Hand Bag , Watch',
    status: 'Items Received',
    date: '22 May, 2023',
    amount: 314,
    payment_method: 'Visa',
    order_status: 'Cancel',
  },
  {
    invoice: '#INV2150',
    customer: {
      name: 'Joe K. Hall',
      image: 'assets/images/users/avatar-7.jpg',
    },
    items: 'Headphone , Dress',
    status: 'Items Received',
    date: '15 Mar, 2023',
    amount: 591,
    payment_method: 'Paypal',
    order_status: 'Completed',
  },
  {
    invoice: '#INV5636',
    customer: {
      name: 'Ralph Hueber',
      image: 'assets/images/users/avatar-8.jpg',
    },
    items: 'Headphone',
    status: 'Items Received',
    date: '19 Dec, 2023',
    amount: 815,
    payment_method: 'Visa',
    order_status: 'Completed',
  },
  {
    invoice: '#INV2940',
    customer: {
      name: 'Sarah Drescher',
      image: 'assets/images/users/avatar-9.jpg',
    },
    items: 'Cap , Sunglass , Hand Bag',
    status: 'Items Received',
    date: '11 Jun, 2023',
    amount: 715,
    payment_method: 'Mastercard',
    order_status: 'Completed',
  },
  {
    invoice: '#INV9027',
    customer: {
      name: 'Leonie Meister',
      image: 'assets/images/users/avatar-10.jpg',
    },
    items: 'Headphone , T-shirt',
    status: 'Items Received',
    date: '19 Mar, 2023',
    amount: 351,
    payment_method: 'Paypal',
    order_status: 'Pending',
  },
];
