import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateStatementTransferUseCase } from './CreateStatementTransferUseCase';


enum OperationType {
  TRANSFER = 'transfer'
}

export class CreateStatementTransferController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { user_id: receiver_id } = request.params
    const { amount, description } = request.body;

    const createStatementTransfer = container.resolve(CreateStatementTransferUseCase);

    const dto = {
      receiver_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    }

    const statement = await createStatementTransfer.execute(dto);

    return response.status(201).json(statement);
  }
}
