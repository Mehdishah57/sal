import Autowired from "./Autowired";
import Component from "./Component";
import Controller from "./Controller";
import Get from "./Get";
import { container } from "./main";
import { Request, RequestHandler, Response } from "express"

@Component
class UserRepository {
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

@Component
class UserService {
    @Autowired private userRepo: UserRepository

    public async getUser() {
        return await this.userRepo.getUser()
    }
}

@Controller()
class Test {
    @Autowired private userService: UserService

    constructor() {
        this.getUser = this.getUser.bind(this)
    }

    @Get()
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser()
        res.status(200).send(user)
    }
}

// const test: Test = container.instances['Test']
// test.getUser().then(data => console.log(data))

container.app.listen(3500, () => console.log("listening at port 3500"))

export default Test