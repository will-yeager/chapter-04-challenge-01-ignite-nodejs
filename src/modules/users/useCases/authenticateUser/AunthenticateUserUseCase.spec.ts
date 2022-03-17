import { hash } from "bcryptjs"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"



describe("Authenticate an user", () => {

    let authenticateUserUseCase: AuthenticateUserUseCase
    let usersRepositoryInMemory: InMemoryUsersRepository
    let passwordHash: string;
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
        passwordHash = await hash("teste123", 8);
    })

    it("should be able authenticate an user", async () => {
        await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste123@gmail.com",
            password: passwordHash
        })

        const auth = await authenticateUserUseCase.execute({
            email: "teste123@gmail.com",
            password: "teste123"
        })

        expect(auth).toHaveProperty("user")
        expect(auth).toHaveProperty("token")
    })

    it("should not be able authenticate an user with wrong password", async () => {
        await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste1234@gmail.com",
            password: passwordHash
        })

        expect( async () => {
            await authenticateUserUseCase.execute({
                email: "teste1234@gmail.com",
                password: "teste1235"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it("should not be able authenticate an user with wrong email", async () => {
        await usersRepositoryInMemory.create({
            name: "teste123",
            email: "teste1235@gmail.com",
            password: passwordHash
        })

        expect( async () => {
            await authenticateUserUseCase.execute({
                email: "teste123@email",
                password: "teste123"
            })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})