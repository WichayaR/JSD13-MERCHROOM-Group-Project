// src/data/orders.js

/**
 * Mock Order Data Source - อิงจาก Order.js Mongoose Schema
 */
const MOCK_ORDERS = [
  {
    _id: 'ord_65f1b99201a2b3c4d5e6f7a8',
    userId: 'usr_65f1a2b3c4d5e6f7a8b9c0d1',
    items: [
      {
        _id: 'itm_01',
        productId: 'prod_101',
        name: 'MERCHROOM x THAI HERITAGE OVERSIZED TEE',
        price: 1290,
        quantity: 1,
      },
      {
        _id: 'itm_02',
        productId: 'prod_102',
        name: 'NEON YAK VINYL FIGURE (LIMITED EDITION)',
        price: 3500,
        quantity: 1,
      },
    ],
    totalAmount: 4790,
    status: 'delivered', // pending | processing | shipping | delivered | cancelled
    shippingProvider: 'KERRY EXPRESS',
    shippingAddress: '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    purchaseDate: '2026-09-02T14:30:00Z',
    createdAt: '2026-09-02T14:30:00Z',
  },
  {
    _id: 'ord_65f1b98452a2b3c4d5e6f7a9',
    userId: 'usr_65f1a2b3c4d5e6f7a8b9c0d1',
    items: [
      {
        _id: 'itm_03',
        productId: 'prod_103',
        name: 'CYBERPUNK TUK-TUK POSTER SET (A2)',
        price: 890,
        quantity: 1,
      },
    ],
    totalAmount: 890,
    status: 'shipping',
    shippingProvider: 'FLASH EXPRESS',
    shippingAddress: '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    purchaseDate: '2026-08-15T09:15:00Z',
    createdAt: '2026-08-15T09:15:00Z',
  },
  {
    _id: 'ord_65f1b95100a2b3c4d5e6f7b0',
    userId: 'usr_65f1a2b3c4d5e6f7a8b9c0d1',
    items: [
      {
        _id: 'itm_04',
        productId: 'prod_104',
        name: 'BANGKOK NIGHTS HOODIE - BLACK',
        price: 2490,
        quantity: 1,
      },
    ],
    totalAmount: 2490,
    status: 'cancelled',
    shippingProvider: '-',
    shippingAddress: '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    purchaseDate: '2026-05-10T18:45:00Z',
    createdAt: '2026-05-10T18:45:00Z',
  },
];

export const getOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_ORDERS]), 200);
  });
};

export const getOrderById = async (orderId) => {
  return new Promise((resolve) => {
    const order = MOCK_ORDERS.find((o) => o._id === orderId);
    setTimeout(() => resolve(order || null), 200);
  });
};
