import { Router } from "express"
import { container } from "./main"
import Component from "./Component"
import { MiddlewareScope } from "./constants";

const Controller = (route = "/") => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    // Register constroller as a component
    Component(constructor);

    // Register route for component
    container.routers[constructor.name] = Router(); 

    // Register route in express app
    try {
        container.app.use(
            route, 
            ...(container.middlewares?.[constructor.name]?.[MiddlewareScope.CONTROLLER]?.handlers?.map?.((handlers) =>  handlers) || []),
            container.routers[constructor.name]
        )
    } catch (error) {
        console.error(error)
        throw new Error(`You must initialize container express app before using @Controller.
        \ncont app = express();
        \ncontainer.app = app;
        \n{ here goes all your controller imports }
        \nJust make sure to put controller imports after setting container.app = app;\n`)
    }

    // Resgister all pending registration routes for controller if available
    if(!container.pendingRegisteration[constructor.name]?.length) return;
    
    container.pendingRegisteration[constructor.name].forEach(({ route, handlerName, method }) => {
        const middlewares = container.middlewares[constructor.name]?.[handlerName]?.handlers || []
        const injectablePropsForMethod = container.requestHandlerParams?.[constructor.name]?.[handlerName]
        container.routers[constructor.name][method](route, ...middlewares, async(req, res, next) => {
            try {
                let methodParams = [req, res, next]
                if(injectablePropsForMethod) {
                    methodParams = []
                    // This is only for validating inputs against @Body decorator
                    for(const [key, value] of Object.entries(injectablePropsForMethod)) {
                        const { type, marker } = value
                        if(marker === "@Body") {
                            const inst = new type()
                            Object.keys(req.body || {}).forEach(key => {
                                inst[key] = req.body[key]
                            })
                            await container.validate(inst)
                            methodParams[key] = req.body
                        }
                        else if(marker === "@Req") methodParams[key] = req
                        else if(marker === "@Res") methodParams[key] = res
                    }
                }
                const data = await container.instances[constructor.name][handlerName]?.(...methodParams);
                console.log(data)
                if(data) res.status(200).send(data)
            } catch (error) {
                try {
                    if(Array.isArray(error))
                        return res.status(400).send({ message: Object.values(error[0].constraints)[0] })
                    if(error?.errors?.length)
                        return res.status(400).send({ message: error?.errors?.[0] })
                    const { message, status } = JSON.parse(error.message)
                    res.status(status).send({ message })
                } catch (error) {
                    res.status(500).send({ message: "Internal Server Error" })
                }
            }
        })
    })
}

export default Controller