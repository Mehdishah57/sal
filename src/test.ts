import Autowired from "./Autowired";
import Component from "./Component";
import Controller from "./Controller";
import Get from "./Get";
import { container } from "./main";
import { Request, Response } from "express"
import { express } from "./index"

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

@Controller("/api/user")
class Test {
    @Autowired private userService: UserService

    @Get("/:id")
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser()
        return { ...user, idSent: req.params?.id }
    }
}

const app = express()
app.listen(3500, () => console.log("listening at port 3500"))

export default Test