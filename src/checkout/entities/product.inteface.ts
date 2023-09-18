export interface ProductKey {
  id?: string;
}

export interface Product extends ProductKey {
  name?: string;
  description?: string;
  amount?: number;
  thumbnail?: string;
}
