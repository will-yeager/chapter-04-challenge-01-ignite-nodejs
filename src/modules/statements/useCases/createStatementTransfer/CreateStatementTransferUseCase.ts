import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementTransferDTO } from "./ICreateStatementTransferDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

@injectable()
export class CreateStatementTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({
    receiver_id,
    sender_id,
    type,
    amount,
    description
  }: ICreateStatementTransferDTO) {
    const receiverUser = await this.usersRepository.findById(receiver_id);
    const senderUser = await this.usersRepository.findById(sender_id);

    if (!receiverUser || !senderUser) {
      throw new CreateStatementError.UserNotFound();
    }
    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    await this.statementsRepository.create({
      user_id: sender_id,
      amount,
      type: OperationType.WITHDRAW,
      description: `Transfer to ${receiverUser.name}: ${description}`
    });

    const statementTransferOperation = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id,
      type,
      amount,
      description,
    })

    return statementTransferOperation;
  }
}
