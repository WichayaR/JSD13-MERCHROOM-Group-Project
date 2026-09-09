const ORDERS_KEY = 'merchroom_orders';

export const PAYMENT_METHODS = [
  {
    id: 'promptpay',
    label: 'PromptPay',
    description: 'สแกน QR Code เพื่อชำระเงิน',
  },
  {
    id: 'card',
    label: 'บัตรเครดิต / เดบิต',
    description: 'Visa, Mastercard, JCB',
  },
  {
    id: 'bank',
    label: 'โอนเงินผ่านธนาคาร',
    description: 'ชำระเงินโอนเข้าบัญชีธนาคาร',
  },
  {
    id: 'cod',
    label: 'เก็บเงินปลายทาง (COD)',
    description: 'ชำระเงินเมื่อได้รับสินค้า',
  },
];

export function generateOrderId() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MR-${yyyy}${mm}${dd}-${rand}`;
}

export function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return order;
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function getOrderById(orderId) {
  return getOrders().find((order) => order.id === orderId) || null;
}