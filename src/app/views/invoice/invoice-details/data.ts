type ProductType = {
  image: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  shipping: number;
  total: number;
};

export const invoiceProduct: ProductType[] = [
  {
    image: 'assets/images/product/p-1.png',
    name: 'Men Black Slim Fit T-shirt',
    size: 'M',
    quantity: 1,
    price: 80.0,
    shipping: 3.0,
    total: 83.0,
  },
  {
    image: 'assets/images/product/p-5.png',
    name: 'Dark Green Cargo Pant',
    size: 'M',
    quantity: 3,
    price: 110.0,
    shipping: 4.0,
    total: 330.0,
  },
  {
    image: 'assets/images/product/p-8.png',
    name: 'Men Dark Brown Wallet',
    size: 'S',
    quantity: 1,
    price: 132.0,
    shipping: 5.0,
    total: 137.0,
  },
  {
    image: 'assets/images/product/p-10.png',
    name: "Kid's Yellow T-shirt",
    size: 'S',
    quantity: 2,
    price: 110.0,
    shipping: 5.0,
    total: 223.0,
  },
];
