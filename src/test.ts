import Autowired from "./Autowired";
import Component from "./Component";
import { container } from "./main";

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
        return await this.userRepo?.getUser()
    }
}

@Component
class Test {
    @Autowired private userService: UserService

    public async getUser() {
        return await this.userService?.getUser()
    }
}

const test: Test = container.instances['Test']
test.getUser().then(data => console.log(data))

export default Test