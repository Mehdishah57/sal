import { Router } from "express"
import { container } from "./main"
import Component from "./Component"
import { ParamDecorators } from "./enums/constants";

const Controller = (route = "/") => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    // Register constroller as a component
    Component(constructor);

    // Add this controller to controllers
    container.controllers[constructor.name] = { route, router: Router() }

    // Resgister all pending registration routes for controller if available
    if(!container.pendingRegisteration[constructor.name]?.length) return;
    
    container.pendingRegisteration[constructor.name].forEach(({ route, handlerName, method }) => {
        const middlewares = container.middlewares[constructor.name]?.[handlerName]?.handlers || []
        const injectablePropsForMethod = container.requestHandlerParams?.[constructor.name]?.[handlerName]
        container.controllers[constructor.name].router[method](route, ...middlewares, async(req, res, next) => {
            try {
                let methodParams = [req, res, next]
                if(injectablePropsForMethod) {
                    methodParams = []
                    // This is only for validating inputs against @Body decorator
                    for(const [key, value] of Object.entries(injectablePropsForMethod)) {
                        const { type, marker } = value
                        if([ParamDecorators.BODY, ParamDecorators.PARAMS, ParamDecorators.QUERY].includes(marker)) {
                            const inst = new type()
                            if(inst?.schema) {
                                await inst.schema.validate?.(req[marker])
                            }
                            if(!inst?.schema) {
                                Object.keys(req[marker] || {}).forEach(key => {
                                    inst[key] = req[marker][key]
                                })
                                await container.validate(inst)
                            }
                            methodParams[key] = req[marker]
                        }
                        else if(marker === ParamDecorators.REQ) methodParams[key] = req
                        else if(marker === ParamDecorators.RES) methodParams[key] = res
                    }
                }
                const data = await container.instances[constructor.name][handlerName]?.(...methodParams);
                if(data) res.status(200).send(data)
            } catch (error) {
                try {
                    if(Array.isArray(error))
                        return res.status(400).send({ message: Object.values(error[0].constraints)[0] })
                    if(error?.errors?.length)
                        return res.status(400).send({ message: error?.errors?.[0] })
                    if(error?.details?.length)
                        return res.status(400).send({ message: error.details?.[0]?.message })

                    /* Handling errors thrown by sal-exceptions */
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