export interface InstallmentKey {
  id?: string;
}
export interface Installment extends InstallmentKey {
  amount?: number;
  number?: number;
  due_date?: Date;
  paid?: boolean;
}
