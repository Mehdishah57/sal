import { Autowired } from "./Autowired";
import container from "./main"

interface UserService {
    getUser: () => string;
}

@Autowired
class Test {
    private userService: UserService

    public async getUser() {
        return this.userService.getUser()
    }
}

export default Test