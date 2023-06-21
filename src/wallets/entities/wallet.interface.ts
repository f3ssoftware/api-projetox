export interface WalletKey {
  id: string;
}

export interface Wallet extends WalletKey {
  currency: string;
  active: boolean;
  name: string;
  createdAt: Date;
  user_id: string;
}
