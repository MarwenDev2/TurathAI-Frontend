import { currency } from "@common/constants";

type CategoryType = {
  image: string;
  description: string;
  price: string;
  role: string;
  sku: string;
  id: string;
};

export const categoryList: CategoryType[] = [
  {
    image: 'assets/images/product/p-1.png',
    description: "Fashion Men , Women & Kid's",
    price: `${currency}80 to ${currency}400`,
    role: 'Seller',
    sku: 'FS16276',
    id: '46233',
  },
  {
    image: 'assets/images/product/p-2.png',
    description: 'Women Hand Bag',
    price: `${currency}120 to ${currency}500`,
    role: 'Admin',
    sku: 'HB73029',
    id: '2739',
  },
  {
    image: 'assets/images/product/p-4.png',
    description: 'Cap and Hat',
    price: `${currency}50 to ${currency}200`,
    role: 'Admin',
    sku: 'CH492-9',
    id: '1829',
  },
  {
    image: 'assets/images/product/p-6.png',
    description: 'Electronics Headphone',
    price: `${currency}100 to ${currency}700`,
    role: 'Seller',
    sku: 'EC23818',
    id: '1902',
  },
  {
    image: 'assets/images/product/p-7.png',
    description: 'Foot Wares',
    price: `${currency}70 to ${currency}400`,
    role: 'Seller',
    sku: 'FW11009',
    id: '2733',
  },
  {
    image: 'assets/images/product/p-8.png',
    description: 'Wallet Categories',
    price: `${currency}120 to ${currency}300`,
    role: 'Admin',
    sku: 'WL38299',
    id: '890',
  },
  {
    image: 'assets/images/product/p-11.png',
    description: 'Electronics Watch',
    price: `${currency}60 to ${currency}400`,
    role: 'Seller',
    sku: 'SM37817',
    id: '250',
  },
  {
    image: 'assets/images/product/p-9.png',
    description: 'Eye Ware & Sunglass',
    price: `${currency}70 to ${currency}500`,
    role: 'Admin',
    sku: 'EG37878',
    id: '1900',
  },
];
