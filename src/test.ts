import { Autowired } from "./Autowired";
import { Service } from "./Service";

@Service
class UserService {
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

@Service
class Test {
    constructor(
        private userService: UserService
    ) {}

    public async getUser() {
        return await this.userService.getUser()
    }
}

export default Test