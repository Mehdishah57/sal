import { MiddlewareScope } from "./constants";
import { container } from "./main";
import { IApp } from "./types";
import express from "express"

const App = ({ port, controllers, middlewares }: IApp) => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    const app = express()

    /* Attach Middlewares from outside */
    middlewares?.forEach(middleware => app.use(middleware))

    controllers.forEach(controller => {
        const { route, router } = container.controllers[controller.name]
        const middlewares = container.middlewares?.[controller.name]?.[MiddlewareScope.CONTROLLER]?.handlers?.map?.((handlers) => handlers) || []
        app.use(route, ...middlewares, router)
    })
    
    container.apps[constructor.name] = { port, controllers }
    app.listen(port, () => console.log(`${constructor.name} started at ${port}`))
}

export default App