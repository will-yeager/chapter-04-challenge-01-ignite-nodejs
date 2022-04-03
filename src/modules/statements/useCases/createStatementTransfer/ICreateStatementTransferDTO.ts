import { Statement } from "../../entities/Statement";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export interface ICreateStatementTransferDTO {
  receiver_id: string
  sender_id: string,
  type: OperationType,
  amount: number,
  description: string
}
