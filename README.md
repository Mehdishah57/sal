This library aims to facilitate making express apps with dependency injection.
Interface of this library is very simple and we aim to keep it close to express.

To beign, you can create an express app just like you would do normally with an addition.

```ts
import express from "express"
import { container } from "@mehdishah/sal"

const app = express()
container.app = app; // This step is needed to use Controllers. However, it isn't needed for DI Injections.

const PORT = process.env.PORT || 3600
app.listen(PORT, () => console.log(`server at ${PORT}`))
```

This will get a basic app started over just like you do in express.
Now normally, you would create routers, and controllers in traditional way and register them
but now, instead of doing that, all you have to do is import @Controller and @Get @Post ...etc mappings
and make a controller like this:

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

Here is a example for how would development flow go with this library

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
import { Request, Response } from "express";
import UserService from "./user.service";

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

As for middlewares, you can apply them to Controllers or handlers / methods of controllers like this.

```ts
const permission: RequestHandler = (req, res, next) => {
    console.log("passing permission check")
    next()
}
const logger: RequestHandler = (req, res, next) => {
    console.log(req.baseUrl)
    next()
}
const auth: RequestHandler = (req, res, next) => {
    console.log("passing user authentication")
    next()
}

@Controller("/api/users")
@Middlewares(logger)
class Test {
    @Autowired private userService: UserService

    @Get("/")
    @Middlewares(auth, permission)
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser()
        return user
    }
}
```

These are normal express middlewares and can have customized implementation as per your needs.
To be straight forward, you can pass your existing middlewares to @Middleware decorator
and apply it to either methods / controllers.
For global middlwares, you can simple use 
```ts
app.use(/* add middlewares to express app */)
```