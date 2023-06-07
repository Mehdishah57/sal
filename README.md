This library aims to facilitate making express apps with dependency injection.
Interface of this library is very simple and we aim to keep it close to express.

To beign, you can create an express app just like you would do normally with an addition.

```ts
import express from "express"
import { container } from "sal-core"

const app = express()
container.app = app; // This step is needed to use Controllers. However, it isn't needed for DI Injections.

/* controller imports should go here later */

const PORT = process.env.PORT || 3600
app.listen(PORT, () => console.log(`server at ${PORT}`))
```

This will get a basic app started over just like you do in express.
Now normally, you would create routers, and controllers in traditional way and register them
but now, instead of doing that, all you have to do is import @Controller and mappings:
@GetMapping, @PostMapping, @PutMapping, @PatchMapping, @DeleteMapping
and make a controller like this:

```ts
import { Controller, GetMapping } from "sal-core";
import { Request, Response } from "express";

@Controller("/api/user")
class UserController {
    @GetMapping("/:id")
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
import { Component } from "sal-core"

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
import { Autowired, Component } from "sal-core";
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
import { Autowired, Controller, GetMapping } from "sal-core";
import { Request, Response } from "express";
import UserService from "./user.service";

@Controller("/api/user")
class UserController {
    @Autowired private userService: UserService

    @GetMapping("/:id")
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser()
        res.status(200).send({ ...user, params: req.params, query: req.query })   
    }
}

export default UserController
```

# Middlewares:

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

    @GetMapping("/")
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

# Circular Dependencies:

In case of circular dependencies, you will notice that @Autowired will throw a BeanCurrentlyInCreationException.
If you ever come across such a case, where you just have to manage circular dependencies, use @Lazy("type:string").

here is an example:

user.service.ts
```ts
@Component
class UserService {
    @Autowired private userRepo: UserRepository

    public async getUser() {
        return await this.userRepo.getUser()
    }
}

export default UserService
```

user.repository.ts
```ts

@Component
class UserRepository {
    @Lazy("UserService") private userService: UserService
    
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

export default UserRepository
```

@Lazy is fully safe to use now, but it is good to refactor sometimes because circular dependency can also come from a
poort design.

# Exceptions

Exceptions can be handy, and you can control status codes, with messages that are thrown.
you can throw these exceptions in controllers, services or repositories.
It is not recommended to thorw these in middlewares because they currently don't have support for handling them.

1. BadRequestException
2. NotFoundException
3. UnauthorizedException
4. ForbiddenException
5. CustomException

```ts
import { BadRequestException } from 'sal-core'

// Throws error with status 404 and message passed to its constructor.
throw new BadRequestException("something was bad")
```

You can expect this response when above exception is thrown:

```ts
// It will have a status code of 400
{ message: "something was bad" }
```

As for CustomException, you have to pass both `message` and `status` as constructor parameters.
thus giving you control over status code as well.

```ts
import { CustomException } from 'sal-core'

throw new CustomException("something was wrong", 400)
```


# Container Api

The di-container exposes following properties. Try not to mess with them.

## container.classes

Classes property has all the non-instantiated class-constructors stored in them that were collected by either
@Controller or @Component decorators.

## container.instances

Instances property has all the instantiated class-constructors stored in them that were collected by
@Controller or @Component decorators.

## container.app

App is the default express app, that you can supply to use @Controller, @Get, @Post, @Put, @Patch & @Delete
as shown in example above.

## container.routers

@Controller decorator, registers an express router like this:
```ts 
const router = Router()
```
and that particular router, is stored against the name of container class as a hashmap like this:

```ts
@Controller("/api/products")
class ProductController {}
```

hashmap will look like this:

```ts
{ ProductController: [Function: router] { /* This router was registered by @Controller */ } }
```