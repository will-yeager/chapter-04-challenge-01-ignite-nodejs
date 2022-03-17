import { hash } from "bcryptjs"
import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe("Get Balance", () => {

    let getbalanceUseCase: GetBalanceUseCase
    let usersRepositoryInMemory: InMemoryUsersRepository
    let statementsRepositoryInMemory: InMemoryStatementsRepository
    let passwordHash: string;
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        getbalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory)
        passwordHash = await hash("teste123", 8);
    })

    it("should be able to get balance of an user", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste123@gmail.com",
            password: passwordHash
        })

        let balance
        if(user.id) {
            balance = await getbalanceUseCase.execute({user_id: user.id})
        }

        expect(balance).toHaveProperty("balance")
    })

    it("should be able to get balance of an not existing user", async () => {
        expect( async () => {
            await getbalanceUseCase.execute({user_id: "uuuuid"})
        }).rejects.toBeInstanceOf(AppError)    
    })
})