import { currency, currentYear } from '@/app/common/constants'

export type Employees = {
  id: string
  name: string
  email: string
  position: string
  company: string
  country: string
}

export type PaginationType = {
  id: string
  name: string
  date: string
  price: string
}

const records: Employees[] = [
  {
    id: '11',
    name: 'Alice',
    email: 'alice@example.com',
    position: 'Software Engineer',
    company: 'ABC Company',
    country: 'United States',
  },
  {
    id: '12',
    name: 'Bob',
    email: 'bob@example.com',
    position: 'Product Manager',
    company: 'XYZ Inc',
    country: 'Canada',
  },
  {
    id: '13',
    name: 'Charlie',
    email: 'charlie@example.com',
    position: 'Data Analyst',
    company: '123 Corp',
    country: 'Australia',
  },
  {
    id: '14',
    name: 'David',
    email: 'david@example.com',
    position: 'UI/UX Designer',
    company: '456 Ltd',
    country: 'United Kingdom',
  },
  {
    id: '15',
    name: 'Eve',
    email: 'eve@example.com',
    position: 'Marketing Specialist',
    company: '789 Enterprises',
    country: 'France',
  },
  {
    id: '16',
    name: 'Frank',
    email: 'frank@example.com',
    position: 'HR Manager',
    company: 'ABC Company',
    country: 'Germany',
  },
  {
    id: '17',
    name: 'Grace',
    email: 'grace@example.com',
    position: 'Financial Analyst',
    company: 'XYZ Inc',
    country: 'Japan',
  },
  {
    id: '18',
    name: 'Hannah',
    email: 'hannah@example.com',
    position: 'Sales Representative',
    company: '123 Corp',
    country: 'Brazil',
  },
  {
    id: '19',
    name: 'Ian',
    email: 'ian@example.com',
    position: 'Software Developer',
    company: '456 Ltd',
    country: 'India',
  },
  {
    id: '20',
    name: 'Jane',
    email: 'jane@example.com',
    position: 'Operations Manager',
    company: '789 Enterprises',
    country: 'China',
  },
]

const pagination: PaginationType[] = [
  {
    id: '#RB2320',
    name: 'Alice',
    date: '07 Oct, ' + currentYear,
    price: `${currency}24.05`,
  },
  {
    id: '#RB8652',
    name: 'Bob',
    date: '07 Oct, ' + currentYear,
    price: `${currency}26.15`,
  },
  {
    id: '#RB8520',
    name: 'Charlie',
    date: '06 Oct, ' + currentYear,
    price: `${currency}21.25`,
  },
  {
    id: '#RB9512',
    name: 'David',
    date: '05 Oct, ' + currentYear,
    price: `${currency}25.03`,
  },
  {
    id: '#RB7532',
    name: 'Eve',
    date: '05 Oct, ' + currentYear,
    price: `${currency}22.61`,
  },
  {
    id: '#RB9632',
    name: 'Frank',
    date: '04 Oct, ' + currentYear,
    price: `${currency}24.05`,
  },
  {
    id: '#RB7456',
    name: 'Grace',
    date: '04 Oct, ' + currentYear,
    price: `${currency}26.15`,
  },
  {
    id: '#RB3002',
    name: 'Hannah',
    date: '04 Oct, ' + currentYear,
    price: `${currency}21.25`,
  },
  {
    id: '#RB9857',
    name: 'Ian',
    date: '03 Oct, ' + currentYear,
    price: `${currency}22.61`,
  },
  {
    id: '#RB2589',
    name: 'Jane',
    date: '03 Oct, ' + currentYear,
    price: `${currency}25.03`,
  },
]
export { records, pagination }
