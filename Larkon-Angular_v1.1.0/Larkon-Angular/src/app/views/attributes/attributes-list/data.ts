type AttributeType = {
  id: string;
  category: string;
  options: string;
  type: string;
  date: string;
  checked: boolean;
};

export const AttributeData: AttributeType[] = [
  {
    id: 'BR-3922',
    category: 'Brand',
    options: 'Dyson , H&M, Nike , GoPro , Huawei , Rolex , Zara , Thenorthface',
    type: 'Dropdown',
    date: '10 Sep 2023',
    checked: true,
  },
  {
    id: 'CL-3721',
    category: 'Color',
    options: 'Black , Blue , Green , Yellow , White',
    type: 'Dropdown',
    date: '16 May 2024',
    checked: true,
  },
  {
    id: 'SZ-2291',
    category: 'Size',
    options: 'XS , S , M , XL , XXL , 3XL',
    type: 'Radio',
    date: '27 Jan 2024',
    checked: true,
  },
  {
    id: 'WG-9212',
    category: 'Weight',
    options: '500gm , 1kg , 2kg , 3kg , up to 4kg',
    type: 'Radio',
    date: '12 March 2024',
    checked: true,
  },
  {
    id: 'PC-1022',
    category: 'Packaging',
    options: 'Paper Box , Plastic Box , Heard Box , Tin',
    type: 'Dropdown',
    date: '02 Jan 2024',
    checked: false,
  },
  {
    id: 'ML-0022',
    category: 'Material',
    options: 'Cotton , Polyester , Leather , Chiffon , Denim , Linen , Satin',
    type: 'Dropdown',
    date: '20 April 2024',
    checked: false,
  },
  {
    id: 'MM-9011',
    category: 'Memory',
    options: '64 , 128 , 250 , 512 , 1TB',
    type: 'Radio',
    date: '29 March 2024',
    checked: true,
  },
  {
    id: 'SZ-2911',
    category: 'Shoes Size',
    options: '18 to 22 , 38 to 44',
    type: 'Radio',
    date: '03 Dec 2023',
    checked: true,
  },
  {
    id: 'ST-4525',
    category: 'Style',
    options: 'Classic , Modern , Ethnic , Western',
    type: 'Dropdown',
    date: '30 Jun 2024',
    checked: false,
  },
];
