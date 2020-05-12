const CART_KEY = "CART";

export const calculatePrice = (items) => {
  return items.reduce((acc, item) => item.price * item.quantity + acc, 0);
};

// Cart storage in LS
export const setCart = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const getCart = (cartKey = CART_KEY) => {
  if (localStorage && localStorage.getItem(cartKey)) {
    return JSON.parse(localStorage.getItem(cartKey));
  }
  return [];
};
