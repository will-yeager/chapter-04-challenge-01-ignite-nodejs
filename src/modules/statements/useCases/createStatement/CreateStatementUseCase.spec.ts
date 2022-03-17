import { hash } from "bcryptjs"
import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

describe("Create Statement", () => {

    let usersRepositoryInMemory: InMemoryUsersRepository
    let statementsRepositoryInMemory: InMemoryStatementsRepository
    let createStatementUseCase: CreateStatementUseCase
    let passwordHash: string

    enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
    }

    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
        passwordHash = await hash("teste123", 8);
    })

    it("should be able to create a statement deposit", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste123@gmail.com",
            password: passwordHash
        })

        let statement;
        if (user.id) {
            statement = await createStatementUseCase.execute({
                    user_id: user.id,
                    type: OperationType.DEPOSIT,
                    amount: 100,
                    description: "deposit"
            })
        }

        expect(statement).toHaveProperty("id")
        expect(statement).toHaveProperty("user_id")
        expect(statement).toHaveProperty("amount")
        expect(statement).toHaveProperty("type")
    })

    it("should be able to create a statement withdraw", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste123@gmail.com",
            password: passwordHash
        })

        let statement;
        if (user.id) {
            await createStatementUseCase.execute({
                user_id: user.id,
                type: OperationType.DEPOSIT,
                amount: 1000,
                description: "deposit"
            })

            statement = await createStatementUseCase.execute({
                    user_id: user.id,
                    type: OperationType.WITHDRAW,
                    amount: 100,
                    description: "withdraw"
            })
        }

        expect(statement).toHaveProperty("id")
        expect(statement).toHaveProperty("user_id")
        expect(statement).toHaveProperty("amount")
        expect(statement).toHaveProperty("type")
    })

    it("should not be able to create a statement deposit in a non existing user", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                    user_id: "uuid",
                    type: OperationType.DEPOSIT,
                    amount: 100,
                    description: "deposit"
            })
        }).rejects.toBeInstanceOf(AppError)
    })

    it("should not be able to create a statement withdraw asking more amount than have of balance", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste123@gmail.com",
            password: passwordHash
        })

        if (user.id) {
            const user_id = user.id;

            await createStatementUseCase.execute({
                user_id,
                type: OperationType.DEPOSIT,
                amount: 50,
                description: "deposit"
            })

            expect( async () => {
                await createStatementUseCase.execute({
                    user_id,
                    type: OperationType.WITHDRAW,
                    amount: 100,
                    description: "withdraw"
                })
            }).rejects.toBeInstanceOf(AppError)  
        }
    })

})