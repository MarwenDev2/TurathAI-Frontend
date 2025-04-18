type ProductType = {
  name: string;
  image: string;
  size: string[];
  mrp: number;
  price: number;
  items_left: number;
  items_sold: number;
  category: string;
  rating: number;
  reviews: number;
  isFavourite?: boolean;
};

export const ProductList: ProductType[] = [
  {
    name: 'Black T-shirt',
    image: 'assets/images/product/p-1.png',
    size: ['S', 'M', 'L', 'XL'],
    mrp: 100,
    price: 80.0,
    items_left: 486,
    items_sold: 155,
    category: 'Fashion',
    rating: 4.5,
    reviews: 55,
  },
  {
    name: 'Olive Green Leather Bag',
    image: 'assets/images/product/p-2.png',
    size: ['S', 'M'],
    mrp: 150,
    price: 136.0,
    items_left: 784,
    items_sold: 674,
    category: 'Hand Bag',
    rating: 4.1,
    reviews: 143,
    isFavourite: true,
  },
  {
    name: 'Women Golden Dress',
    image: 'assets/images/product/p-3.png',
    size: ['S', 'M'],
    mrp: 250,
    price: 219.0,
    items_left: 769,
    items_sold: 180,
    category: 'Fashion',
    rating: 4.4,
    reviews: 174,
  },
  {
    name: 'Gray Cap For Men',
    image: 'assets/images/product/p-4.png',
    size: ['S', 'M', 'L'],
    mrp: 100,
    price: 76.0,
    items_left: 571,
    items_sold: 87,
    category: 'Cap',
    rating: 4.2,
    reviews: 23,
  },
  {
    name: 'Dark Green Cargo Pent',
    image: 'assets/images/product/p-5.png',
    size: ['S', 'M', 'L', 'XL'],
    mrp: 130,
    price: 110.0,
    items_left: 241,
    items_sold: 342,
    category: 'Fashion',
    rating: 4.4,
    reviews: 109,
  },
  {
    name: 'Orange Multi Color Headphone',
    image: 'assets/images/product/p-6.png',
    size: ['S', 'M'],
    mrp: 250,
    price: 231.0,
    items_left: 821,
    items_sold: 231,
    category: 'Electronics',
    rating: 4.2,
    reviews: 200,
  },
  {
    image: 'assets/images/product/p-7.png',
    name: "Kid's Yellow Shoes",
    size: ['18', '19', '20', '21'],
    mrp: 100,
    price: 89.0,
    items_left: 321,
    items_sold: 681,
    category: 'Shoes',
    rating: 4.5,
    reviews: 321,
    isFavourite: true,
  },
  {
    image: 'assets/images/product/p-8.png',
    name: 'Men Dark Brown Wallet',
    size: ['S', 'M'],
    mrp: 150,
    price: 132.0,
    items_left: 190,
    items_sold: 212,
    category: 'Wallet',
    rating: 4.1,
    reviews: 190,
  },
  {
    image: 'assets/images/product/p-9.png',
    name: 'Sky Blue Sunglass',
    size: ['S', 'M'],
    mrp: 100,
    price: 77.0,
    items_left: 784,
    items_sold: 443,
    category: 'Sunglass',
    rating: 3.5,
    reviews: 298,
    isFavourite: true,
  },
  {
    image: 'assets/images/product/p-10.png',
    name: "Kid's Yellow T-shirt",
    size: ['S'],
    mrp: 140,
    price: 110.0,
    items_left: 650,
    items_sold: 365,
    category: 'Fashion',
    rating: 4.1,
    reviews: 156,
  },
  {
    image: 'assets/images/product/p-11.png',
    name: 'White Rubber Smart Watch',
    size: ['S', 'M'],
    mrp: 110,
    price: 77.0,
    items_left: 98,
    items_sold: 241,
    category: 'Electronics',
    rating: 3.4,
    reviews: 201,
  },
  {
    image: 'assets/images/product/p-12.png',
    name: 'Men Brown Leather Shoes',
    size: ['40', '41', '42', '43'],
    mrp: 250,
    price: 222.0,
    items_left: 176,
    items_sold: 658,
    category: 'Shoes',
    rating: 4.1,
    reviews: 370,
    isFavourite:true
  },
];
