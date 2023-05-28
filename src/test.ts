import { Autowired } from "./Autowired";

interface UserService {
    getUser: () => string;
}
@Autowired
class Test {
    constructor(
        private userService: UserService
    ) {}

    public async getUser() {
        return this.userService.getUser()
    }
}

export default Test