type LatestProductType = {
  name: string;
  image: string;
  variants: number;
  id: string;
  category: string;
  date: string;
  status: string;
};

export const latestProduct: LatestProductType[] = [
  {
    name: 'Black T-shirt',
    image: 'assets/images/product/p-1.png',
    variants: 4,
    id: 'ID46765',
    category: 'Fashion',
    date: '08/05/2023',
    status: 'Published',
  },
  {
    name: 'Olive Green Leather Bag',
    image: 'assets/images/product/p-2.png',
    variants: 2,
    id: 'ID36192',
    category: 'Hand Bag',
    date: '10/05/2023',
    status: 'Pending',
  },
  {
    name: 'Women Golden Dress',
    image: 'assets/images/product/p-3.png',
    variants: 5,
    id: 'ID37729',
    category: 'Fashion',
    date: '20/05/2023',
    status: 'Published',
  },
  {
    name: 'Gray Cap For Men',
    image: 'assets/images/product/p-4.png',
    variants: 3,
    id: 'ID09260',
    category: 'Cap',
    date: '21/05/2023',
    status: 'Published',
  },
  {
    name: 'Dark Green Cargo Pant',
    image: 'assets/images/product/p-5.png',
    variants: 6,
    id: 'ID24109',
    category: 'Fashion',
    date: '23/05/2023',
    status: 'Draft',
  },
];
