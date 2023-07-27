export interface GroupKey {
  id?: string;
}

export interface Group extends GroupKey {
  name?: string;
  label?: string;
  color?: string;
  wallet_id?: string;
}
