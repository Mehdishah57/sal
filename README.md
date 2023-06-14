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
Therefore, you can as of now, make property injections & constructor injections.

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
    @Autowired private userRepo: UserRepository // This is a Property Injection
    constructor(private readonly userRepo: UserRepository) {} // This is a constructor injection

    /* Constructor injections are performed automatically if class is marked as Component */

    public async getUser() {
        return await this.userRepo.getUser() 
    }
}

export default UserService
```

user.controller.ts
```ts
import { Controller, GetMapping } from "sal-core";
import { Request, Response } from "express";
import UserService from "./user.service";

@Controller("/api/user")
class UserController {
    constructor(private readonly userService: UserService) {}

    @GetMapping("/:id")
    public async getUser(req: Request, res: Response) {
        const user = await this.userService.getUser()
        res.status(200).send({ ...user, params: req.params, query: req.query })   
    }
}

export default UserController
```

# Validation using class-validator

For class-validators validations to work, you have to add validateOrReject method to to container like this:

```ts
import express from "express"
import { container } from "sal-core"
import { validateOrReject } from "class-validator"

const app = express()
container.app = app;
container.validate = validateOrReject

/* controller imports should go here later */

const PORT = process.env.PORT || 3600
app.listen(PORT, () => console.log(`server at ${PORT}`))
```

now you can perform validations in controllers via following decorator:
```ts
    class LoginDto {
        @IsString()
        email: string;
        @IsString()
        password: string;
    }

    @PostMapping()
    async test(@Body body: LoginDto) {
        return { ...body, url: req?.url }
    }
```

And yes, thats all you have to do, body will automatically be validated against LoginDto.
for errors you'll get one error as below with 400 status code. 
```ts
{ message: string }
```

Now you'll be thinking how will i access req & res objects in this handlers since that seem to be lost,
We have following additonal decorators as well to manage it:

1. Req (injects request object)

```ts
@Req req: Request
```

2. Res (injects response object)

```ts
@Res res: Response
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
    constructor(private readonly userService: UserService) {}

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

In case of circular dependencies, you will notice that circular property that gets executed first will be undefined
If you ever come across such a case, where you just have to manage circular dependencies, use @Lazy("type:string").

here is an example:

user.service.ts
```ts
@Component
class UserService {
    constructor(private readonly userRepo: UserRepository) {}

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

    constructor(userService: UserService) {
        this.userService = userService
    }
    
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

export default UserRepository
```

OR

user.repository.ts
```ts
@Component
class UserRepository {
    constructor(@Lazy("UserService", "userService") private userService: UserService) {}
    
    public async getUser() {
        return { id: 1, name: "Mehdi" }
    }
}

export default UserRepository
```

@Lazy is fully safe to use now, but it is good to refactor sometimes because circular dependency can also come from a
poor design.

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

## container.set - container.get

This is a method that you can manually use to set an instance against a class,
so when that class type is @Autowired, that instance will be injected to it automatically.

```ts
import { DataSource } from "typeorm"
import { container } from "sal-core"

const dataSource = new DataSoruce({ /* options go here */ })
container.set(DataSource, dataSource);
const dataSource = container.get(DataSource) // It will return the data source instance
```

Now you can inject it like this:

```ts
@Component
class UserRepository {
    constructor(private readonly dataSource: DataSource) {}

    // Use it as you like
}
```

## container.app

App is the default express app, that you can supply to use @Controller, @Get, @Post, @Put, @Patch & @Delete
as shown in example above.