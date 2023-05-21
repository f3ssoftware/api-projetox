export interface WalletKey {
  id: string;
}

export interface Wallet extends WalletKey {
  code: number;
  currency: string;
  name: string;
  createdAt: Date;
  user_id: string;
}
