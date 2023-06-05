export interface WalletKey {
  id: string;
}

export interface Wallet extends WalletKey {
  currency: string;
  name: string;
  createdAt: Date;
  user_id: string;
}
