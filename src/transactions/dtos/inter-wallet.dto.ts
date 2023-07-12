export interface InterWalletDto {
  wallet_id: string;
  amount: number;
  destinatary_wallet_id: string;
  reference: string;
  due_date: Date;
}
