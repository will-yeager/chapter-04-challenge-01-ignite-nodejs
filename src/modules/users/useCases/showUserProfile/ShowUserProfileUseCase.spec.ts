import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Show profile of an user", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
    })

    it("should be able to show profile of an user", async () => {
        const user = await usersRepositoryInMemory.create({
            name: "testeshowprofile",
            email: "testeshowprofile@gmail.com",
            password: "1234"
        })

        let userProfile
        if(user.id) {
            userProfile = await showUserProfileUseCase.execute(user.id)
        }

        expect(userProfile).toHaveProperty("id")
        expect(userProfile).toHaveProperty("name")
        expect(userProfile).toHaveProperty("email")
    })
    
    it("should not be able to show profile of an not existing user", async () => {
        expect( async () => {
            await showUserProfileUseCase.execute("uuuid")
        }).rejects.toBeInstanceOf(AppError)    
    })
})