// src/data/orders.js

/**
 * Mock Order Data Source - อิงจาก Order.js Mongoose Schema
 */
const MOCK_ORDERS = [
  {
    _id: 'ord_65f1b99201a2b3c4d5e6f7a8',
    orderNumber: 'MR-99201-TH',
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
        price: 3210,
        quantity: 1,
      },
    ],
    totalAmount: 4500,
    status: 'delivered', // pending | processing | shipping | delivered | cancelled
    shippingProvider: 'KERRY EXPRESS',
    shippingAddress: '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    purchaseDate: '2024-10-24T14:30:00Z',
    createdAt: '2024-10-24T14:30:00Z',
  },
  {
    _id: 'ord_65f1b88123a2b3c4d5e6f7a9',
    orderNumber: 'MR-88123-TH',
    userId: 'usr_65f1a2b3c4d5e6f7a8b9c0d1',
    items: [
      {
        _id: 'itm_03',
        productId: 'prod_103',
        name: 'CYBERPUNK TUK-TUK POSTER SET (A2)',
        price: 4000,
        quantity: 3,
      },
    ],
    totalAmount: 12000,
    status: 'pending',
    shippingProvider: 'FLASH EXPRESS',
    shippingAddress: '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    purchaseDate: '2024-09-12T09:15:00Z',
    createdAt: '2024-09-12T09:15:00Z',
  },
  {
    _id: 'ord_65f1b77441a2b3c4d5e6f7b0',
    orderNumber: 'MR-77441-TH',
    userId: 'usr_65f1a2b3c4d5e6f7a8b9c0d1',
    items: [
      {
        _id: 'itm_04',
        productId: 'prod_104',
        name: 'BANGKOK NIGHTS HOODIE - BLACK',
        price: 2200,
        quantity: 1,
      },
    ],
    totalAmount: 2200,
    status: 'cancelled',
    shippingProvider: '-',
    shippingAddress: '99/9 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
    purchaseDate: '2024-08-05T18:45:00Z',
    createdAt: '2024-08-05T18:45:00Z',
  },
];

export const getOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_ORDERS]), 200);
  });
};

export const getOrderById = async (orderId) => {
  return new Promise((resolve) => {
    const order = MOCK_ORDERS.find(
      (o) =>
        o._id === orderId ||
        o.orderNumber === orderId ||
        (orderId && o.orderNumber && o.orderNumber.toLowerCase() === orderId.toLowerCase()) ||
        (orderId && o._id.endsWith(orderId))
    );
    setTimeout(() => resolve(order || null), 200);
  });
};
