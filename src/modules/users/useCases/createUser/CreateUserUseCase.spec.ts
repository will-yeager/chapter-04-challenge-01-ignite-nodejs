import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository


describe("Create user", () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "teste",
            email: "teste@email",
            password: "teste"
        })

        expect(user).toHaveProperty("id")
    })
    
    it("should not be able to create a existent user", async () => {
       await createUserUseCase.execute({
            name: "teste 2",
            email: "teste2@email",
            password: "teste2"
        })

        await expect(
            createUserUseCase.execute({
                name: "teste 2",
                email: "teste2@email",
                password: "teste2"
            })).rejects.toBeInstanceOf(CreateUserError)
    })
})