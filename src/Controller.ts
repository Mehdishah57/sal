import { Router } from "express"
import { container } from "./main"
import Component from "./Component"
import { MiddlewareScope } from "./constants";

const Controller = (route = "/") => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    // Register constroller as a component
    Component(constructor);

    // Register route for component
    container.routes[constructor.name] = route;
    container.routers[constructor.name] = Router(); 

    // Register route in express app
    try {
        // console.log(container.middlewares)
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
        const middlewares = container.middlewares[constructor.name][handlerName]?.handlers || []
        container.routers[constructor.name][method](route, ...middlewares, async(req, res, next) => {
            try {
                const data = await container.instances[constructor.name][handlerName]?.(req, res, next);
                if(data) res.status(200).send(data)
            } catch (error) {
                try {
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