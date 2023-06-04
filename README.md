This library aims to facilitate making express apps with dependency injection.
Interface of this library is very simple and we aim to keep it close to express.

To beign, you can create an express app just like you would do normally with an addition.

```ts
import express from "express"
import { container } from "@mehdishah/sal"

const app = express()
container.app = app; // This ios 

const PORT = process.env.PORT || 3600
app.listen(PORT, () => console.log(`server at ${PORT}`))
```

This will get a basic app started over just like you do in express.
Now normally, you would create routers, and controllers in traditional way and register them like this

```ts
class UserController {
    public async getUser() {
        return { id: 1, name: "sal" }
    }
}

export default UserController
```

```ts
import { Router } from "express"

const userRouter = Router()

const userController = new UserController()

userRouter.get("/user", userController.getUser)

```

but now, instead of doing this, all you have to do is import @Controller and @Get @Port ...etc mappings
and make a controller faster than ever:

```ts
import { Controller, Get } from "@mehdishah/sal";
import { Request, Response } from "express";

@Controller("/api/user")
class UserController {
    @Get("/:id")
    public async getUser(req: Request, res: Response) {
        res.status(200).send({ id: 1, name: "sal" })   
    }
}

export default UserController
```

make sure to import this in main.app.ts like this

```ts
import "./user/user.controller"
```

isn't it awesome?

Now that isn't it, this library was mainly designed to be a lightweight singleton dependency injection library.
Therefore, you can as of now, make property injections & even constructor injections (not recommended yet).

user.repository.ts
```ts
import { Component } from "@mehdishah/sal"

@Component
class UserRepository {
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

export default UserRepository
```

user.service.ts
```ts
import { Autowired, Component } from "@mehdishah/sal";
import UserRepository from "./user.repository";

@Component
class UserService {
    @Autowired private userRepo: UserRepository

    public async getUser() {
        return await this.userRepo.getUser() 
    }
}

export default UserService
```

user.controller.ts
```ts
import { Autowired, Controller, Get } from "@mehdishah/sal";
import UserService from "./user.service";
import { Request, Response } from "express";

@Controller("/api/user")
class UserController {
    @Autowired private userService: UserService

    @Get("/:id")
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser()
        res.status(200).send({ ...user, params: req.params, query: req.query })   
    }
}

export default UserController
```