import { Router } from "express"
import { container } from "./main"
import Component from "./Component"

const Controller = (route = "/") => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    // Register constroller as a component
    Component(constructor);

    // Register route for component
    container.routes[constructor.name] = route;
    container.routers[constructor.name] = Router(); 

    // Register route in express app
    container.app.use(route, container.routers[constructor.name])

    // Resgister all pending registration routes for controller if available
    if(!container.pendingRegisteration[constructor.name]?.length) return;
    
    container.pendingRegisteration[constructor.name].forEach(({ route, handlerName, method }) => {
        const handler = container.instances[constructor.name][handlerName]
        container.routers[constructor.name][method](route, handler)
    })
}

export default Controller