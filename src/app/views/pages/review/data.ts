type ReviewerType = {
  name: string;
  title: string;
  avatar: string;
};

type ReviewType = {
  country: string;
  date: string;
  text: string;
  rating: number;
  summary: string;
  reviewer: ReviewerType;
};

export const ReviewData: ReviewType[] = [
  {
    country: 'U.S.A',
    date: '21 December 2023',
    text: 'I recently purchased a t-shirt that I was quite excited about, and I must say, there are several aspects that I really appreciate about it. Firstly, the material is absolutely wonderful.',
    rating: 4.5,
    summary: 'Excellent Quality',
    reviewer: {
      name: 'Michael B. Coch',
      title: 'Kaika Hill, CEO / Hill & CO',
      avatar: 'assets/images/users/avatar-2.jpg',
    },
  },
  {
    country: 'Canada',
    date: '16 March 2023',
    text: "I purchased a pair of jeans Firstly, the fabric is fantastic—it's both durable and comfortable. The denim is soft yet sturdy, making it perfect for everyday wear.",
    rating: 4.5,
    summary: 'Best Quality',
    reviewer: {
      name: 'Theresa T. Brose',
      title: 'Millenia Life, / General internist',
      avatar: 'assets/images/users/avatar-3.jpg',
    },
  },
  {
    country: 'Germany',
    date: '23 October 2023',
    text: 'The fit is perfect, hugging in all the right places while allowing for ease of movement. Overall, this dress exceeded my expectations and has quickly become a favorite in my wardrobe.',
    rating: 4.0,
    summary: 'Good Quality',
    reviewer: {
      name: 'James L. Erickson',
      title: 'Omni Tech Solutions / Founder',
      avatar: 'assets/images/users/avatar-4.jpg',
    },
  },
  {
    country: 'Germany',
    date: '23 October 2023',
    text: 'The fit is perfect, hugging in all the right places while allowing for ease of movement. Overall, this dress exceeded my expectations and has quickly become a favorite in my wardrobe.',
    rating: 4.5,
    summary: 'Good Quality',
    reviewer: {
      name: 'Lily W. Wilson',
      title: 'Grade A Investment / Manager',
      avatar: 'assets/images/users/avatar-5.jpg',
    },
  },
  {
    country: 'Canada',
    date: '29 May 2023',
    text: "Additionally, the fit is perfect, providing great support and comfort for all-day wear. These boots have quickly become a staple in my wardrobe, and I couldn't be happier with my purchase.",
    rating: 4.0,
    summary: 'Excellent Quality',
    reviewer: {
      name: 'Sarah M. Brooks',
      title: 'Metro / Counseling',
      avatar: 'assets/images/users/avatar-6.jpg',
    },
  },
  {
    country: 'U.S.A',
    date: '18 August 2023',
    text: 'The color is rich and vibrant, making it a standout piece in my wardrobe. Overall, this sweater has exceeded my expectations and has quickly become one of my favorite pieces to wear.',
    rating: 4.5,
    summary: 'Best Quality',
    reviewer: {
      name: 'Joe K. Hall',
      title: 'Atlas Realty / Media specialist',
      avatar: 'assets/images/users/avatar-7.jpg',
    },
  },
  {
    country: 'Iceland',
    date: '12 May 2023',
    text: "I ordered my usual size, but the shoes are either too small or too big, making them uncomfortable to wear. I would not recommend them to others not buy product, I couldn't be happier with my purchase",
    rating: 2.0,
    summary: 'Bad Quality',
    reviewer: {
      name: 'Jennifer Schafer',
      title: 'Red Bears Tavern / Director',
      avatar: 'assets/images/users/avatar-9.jpg',
    },
  },
  {
    country: 'Arabic',
    date: '18 September 2023',
    text: "Firstly, the quality of the fabric is exceptional. It's soft, luxurious, and drapes beautifully, giving the dress an elegant and sophisticated look. The design is simply stunning I couldn't be happier with my purchase.",
    rating: 3.0,
    summary: 'Best Quality',
    reviewer: {
      name: 'Nashida Ulfah',
      title: 'Platinum Interior / Manager',
      avatar: 'assets/images/users/avatar-10.jpg',
    },
  },
];
