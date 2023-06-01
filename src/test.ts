import { Autowired } from "./Autowired";
import { Service } from "./Service";
import { container } from "./main";

@Service()
class UserService {
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

@Service([UserService])
class Test {
    constructor(
        private userService: UserService
    ) {}

    public async getUser() {
        return await this.userService.getUser()
    }
}

const test: Test = container.instances['Test']
test.getUser().then(data => console.log(data))

export default Test