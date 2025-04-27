import { StateType } from '@component/state-card/state-card.component'


type WarehouseType = {
  id: string;
  name: string;
  address: string;
  manager: string;
  phone: string;
  inventory: number;
  orders: number;
  revenue: number;
};

export const inventoryState: StateType[] = [
  {
    title: 'Total Product Items',
    items: 3521,
    icon: 'solar:box-broken',
  },
  {
    title: 'In Stock Product',
    items: 1311 ,
    icon: 'solar:reorder-broken',
  },
  {
    title: 'Out Of Stock Product',
    items: 231,
    icon: 'solar:bag-cross-broken',
  },
  {
    title: 'Total Visited Customer',
    items: 2334,
    icon: 'solar:users-group-two-rounded-broken',
  },
];

export const warehouseList: WarehouseType[] = [
  {
    id: '#WH-001',
    name: 'Central Fulfillment',
    address: '123 Commerce St, NY',
    manager: 'John Doe',
    phone: '+1 (555) 123-4567',
    inventory: 6490,
    orders: 3022,
    revenue: 25737,
  },
  {
    id: '#WH-002',
    name: 'East Coast Hub',
    address: '456 Market Ave, NY',
    manager: 'Jane Smith',
    phone: '+1 (555) 234-5678',
    inventory: 7362,
    orders: 4253,
    revenue: 67351,
  },
  {
    id: '#WH-003',
    name: 'West Coast Depot',
    address: '789 Trade Blvd, CA',
    manager: 'Richard Roe',
    phone: '+1 (555) 345-6789',
    inventory: 8842,
    orders: 3221,
    revenue: 45865,
  },
  {
    id: '#WH-004',
    name: 'Southern Distribution',
    address: '101 Supply Rd, TX',
    manager: 'Alice Johnson',
    phone: '+1 (555) 456-7890',
    inventory: 5463,
    orders: 2100,
    revenue: 54655,
  },
  {
    id: '#WH-005',
    name: 'Northern Fulfillment',
    address: '202 Logistics Ln, IL',
    manager: 'Michael Brown',
    phone: '+1 (555) 567-8901',
    inventory: 12643,
    orders: 7008,
    revenue: 92533,
  },
  {
    id: '#WH-006',
    name: 'Midwest Center',
    address: '303 Central St, MO',
    manager: 'Emily Davis',
    phone: '+1 (555) 678-9012',
    inventory: 7553,
    orders: 5600,
    revenue: 43898,
  },
  {
    id: '#WH-007',
    name: 'Southeast Storage',
    address: '404 Storage Dr, FL',
    manager: 'William Green',
    phone: '+1 (555) 789-0123',
    inventory: 9381,
    orders: 5343,
    revenue: 76909,
  },
  {
    id: '#WH-008',
    name: 'Northwest Hub',
    address: '505 Commerce Pl, WA',
    manager: 'Jessica White',
    phone: '+1 (555) 890-1234',
    inventory: 6500,
    orders: 3453,
    revenue: 32765,
  },
  {
    id: '#WH-009',
    name: 'Southwest Fulfillment',
    address: '606 Trade Ave, AZ',
    manager: 'Christopher Black',
    phone: '+1 (555) 901-2345',
    inventory: 7555,
    orders: 9000,
    revenue: 67565,
  },
  {
    id: '#WH-010',
    name: 'Northeast Depot',
    address: '707 Distribution Rd, MA',
    manager: 'Patricia Clark',
    phone: '+1 (555) 012-3456',
    inventory: 5499,
    orders: 3433,
    revenue: 43765,
  },
];
