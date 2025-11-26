
export enum TRANSACTION_TYPE {
  CREDIT = "credit",
  DEBIT = "debit",
}


export interface GetWalletDto {
  _id: string;
  userId: string;
  userType: string;
  balance: number;
}



export interface WalletTransactions {
  _id: string;
  walletId: string;
  type: TRANSACTION_TYPE;
  amount: number;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, string>;
  createdAt?: Date;
}
 
