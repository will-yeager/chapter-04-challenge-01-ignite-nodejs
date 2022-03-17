import { hash } from "bcryptjs"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

describe("Get statement", () => {

    let getStatementOperationUseCase: GetStatementOperationUseCase
    let usersRepositoryInMemory: InMemoryUsersRepository
    let statementsRepositoryInMemory: InMemoryStatementsRepository
    let passwordHash: string

    enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
    }

    beforeEach( async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementsRepositoryInMemory = new InMemoryStatementsRepository
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory)
        passwordHash = await hash("teste123", 8);
    })

    it("should be able to get statement operation", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "testeshowprofile",
            email: "testeshowprofile@gmail.com",
            password: passwordHash
        })

        let statementOperation;
        let statement;
        if(user.id) {
            statement = await statementsRepositoryInMemory.create({
                user_id: user.id,
                description: "deposit",
                amount: 1000,
                type: OperationType.DEPOSIT,
            })

            if(statement.id) {
                statementOperation = await getStatementOperationUseCase.execute({
                    user_id: user.id,
                    statement_id: statement.id
                })
            }
        }

        expect(statementOperation).toHaveProperty("id")
        expect(statementOperation).toHaveProperty("user_id")
        expect(statementOperation).toHaveProperty("amount")
        expect(statementOperation).toHaveProperty("type")
        expect(statementOperation).toHaveProperty("description")
    })

    it("should not be able to get statement operation in a non existing statement", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "testeshowprofile",
            email: "testeshowprofile@gmail.com",
            password: passwordHash
        })

        let statementOperation;
        if(user.id) {
            const user_id = user.id
            expect( async () => {
                statementOperation = await getStatementOperationUseCase.execute({
                    user_id,
                    statement_id: "uuid"
                })
            })
        }
    })
})