type TransactionType = {
  invoice: string;
  status: string;
  amount: number;
  date: string;
  payment_method: string;
};

export const transactionHistory: TransactionType[] = [
  {
    invoice: '#INV2540',
    status: 'Completed',
    amount: 421.0,
    date: '07 Jan, 2023',
    payment_method: 'Mastercard',
  },
  {
    invoice: '#INV3924',
    status: 'Cancel',
    amount: 736.0,
    date: '03 Dec, 2023',
    payment_method: 'Visa',
  },
  {
    invoice: '#INV5032',
    status: 'Completed',
    amount: 347.0,
    date: '28 Sep, 2023',
    payment_method: 'Paypal',
  },
  {
    invoice: '#INV1695',
    status: 'Pending',
    amount: 457.0,
    date: '10 Aug, 2023',
    payment_method: 'Mastercard',
  },
  {
    invoice: '#INV8473',
    status: 'Completed',
    amount: 414.0,
    date: '22 May, 2023',
    payment_method: 'Visa',
  },
];

export const latestInvoice = [
  {
    invoice_id: '#INV2540',
    date: '16 May 2024',
  },
  {
    invoice_id: '#INV0914',
    date: '17 Jan 2024',
  },
  {
    invoice_id: '#INV3801',
    date: '09 Nov 2023',
  },
  {
    invoice_id: '#INV4782',
    date: '21 Aug 2023',
  },
];
