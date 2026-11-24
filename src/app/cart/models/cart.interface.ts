export interface AddToCartResponse {
  message: string;
  numOfCartItems?: number;
}

export interface CartActionResponse {
  message: string;
}

export interface CartProduct {
  _id: string;
  title: string;
  imageCover: string;
  category?: {
    name: string;
  };
  brand?: {
    name: string;
  };
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: CartProduct;
}

export interface UserCart {
  _id: string;
  products: CartItem[];
  totalCartPrice: number;
}

export interface GetCartResponse {
  numOfCartItems: number;
  data: UserCart;
}