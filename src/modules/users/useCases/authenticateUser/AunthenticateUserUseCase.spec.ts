import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Authenticate an user", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("should be able authenticate an user", async () => {
        await createUserUseCase.execute({
            name: "teste123",
            email: "teste123@email",
            password: "teste123"
        })

        const auth = await authenticateUserUseCase.execute({
            email: "teste123@email",
            password: "teste123"
        })

        expect(auth).toHaveProperty("user")
        expect(auth).toHaveProperty("token")
    })
})