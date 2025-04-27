type OrderProductsType = {
  image: string;
  name: string;
  size: string;
  status: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
};

export const orderProducts: OrderProductsType[] = [
  {
    image: 'assets/images/product/p-1.png',
    name: 'Men Black Slim Fit T-shirt',
    size: 'M',
    status: 'Ready',
    quantity: 1,
    price: 80.0,
    tax: 3.0,
    total: 83.0,
  },
  {
    image: 'assets/images/product/p-5.png',
    name: 'Dark Green Cargo Pent',
    size: 'M',
    status: 'Packaging',
    quantity: 3,
    price: 330.0,
    tax: 4.0,
    total: 334.0,
  },
  {
    image: 'assets/images/product/p-8.png',
    name: 'Men Dark Brown Wallet',
    size: 'S',
    status: 'Ready',
    quantity: 1,
    price: 132.0,
    tax: 5.0,
    total: 137.0,
  },
  {
    image: 'assets/images/product/p-10.png',
    name: "Kid's Yellow T-shirt",
    size: 'S',
    status: 'Packaging',
    quantity: 2,
    price: 220.0,
    tax: 3.0,
    total: 223.0,
  },
];
