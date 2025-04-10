export interface Product {
  name: string;
  price: string;
  description: string;
  features: string[];
  image: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Coming Soon';
}

interface ShopData {
  stickers: Product[];
  electronics: Product[];
  services: Product[];
}

const shopProducts: ShopData = {
  stickers: [
    {
      name: 'Nervous Energy',
      price: '$5.00',
      description: 'Show your love for Nervous Energy with this sticker!',
      features: [
        'High quality',
        'Weatherproof',
        'Strong Adhesive'
      ],
      image: '/images/store/nervous-sticker-shot.png',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'Circuit Board Pattern',
      price: '$6.00',
      description: 'Let people know you like catching waves and getting burnt with this sick board.',
      features: [
        'High quality',
        'Weatherproof',
        'Strong Adhesive'
      ],
      image: '/KH_back.svg',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'Retro Computing Icons',
      price: '$7.00',
      description: 'De-overly simplified classic computing logos',
      features: [
        'High quality',
        'Weatherproof',
        'Strong Adhesive'
      ],
      image: '/images/store/WM-sticker-shot.png',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'Geometric Art',
      price: '$8.00',
      description: 'Not all stickers are fore the for-ground',
      features: [
        'High quality',
        'Weatherproof',
        'Strong Adhesive'
      ],
      image: '/images/CEED.svg',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'Virginia Tech Ripoffs',
      price: '$9.00',
      description: 'The merch they don\'t want you to have',
      features: [
        'High quality',
        'Weatherproof',
        'Strong Adhesive'
      ],
      image: '/KH_back.svg',
      stockStatus: 'Coming Soon'
    },
  ],
  electronics: [
    {
      name: 'Pocket Ebook',
      price: '$99.00',
      description: 'Pocket Ebook',
      features: [
        'High quality',
        'Weatherproof'
      ],
      image: '/next.svg',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'Pocket Chess',
      price: '$29.00',
      description: 'Pocket Chess',
      features: [
        'High quality',
        'Weatherproof'
      ],
      image: '/file.svg',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'SBC kit',
      price: '$39.00',
      description: 'SBC kit',
      features: [
        'High quality',
        'Weatherproof'
      ],
      image: '/FullLogo.svg',
      stockStatus: 'Coming Soon'
    },
  ],
  services: [
    {
      name: 'Static website',
      price: '$199.00',
      description: 'Static website',
      features: [
        'High quality',
        'Weatherproof'
      ],
      image: '/globe.svg',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'Web application',
      price: '$299.00',
      description: 'Web application',
      features: [
        'High quality',
        'Weatherproof'
      ],
      image: '/vercel.svg',
      stockStatus: 'Coming Soon'
    },
    {
      name: 'ML consutation',
      price: '$149.00',
      description: 'ML consutation',
      features: [
        'High quality',
        'Weatherproof'
      ],
      image: '/filter.svg',
      stockStatus: 'Coming Soon'
    },
  ]
};

export default shopProducts;
