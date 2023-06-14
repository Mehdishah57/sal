import { container } from "./main";

const ParamDec = (marker: "@Body" | "@Req" | "@Res") => (target: Object, methodName: string, parameterIndex: number) => {
    const type: any = Reflect.getOwnMetadata("design:paramtypes", target, methodName)?.[parameterIndex]
    if(!type) return;

    if(!container.requestHandlerParams[target.constructor.name])
        container.requestHandlerParams[target.constructor.name] = { [methodName]: { [parameterIndex]: { type, marker } } }
    
    else if(!container.requestHandlerParams[target.constructor.name][methodName])
        container.requestHandlerParams[target.constructor.name] = {
            ...container.requestHandlerParams[target.constructor.name],
            [methodName]: { [parameterIndex]: { type, marker } } 
        }
    
    else {
        container.requestHandlerParams[target.constructor.name][methodName] = {
            ...container.requestHandlerParams[target.constructor.name][methodName],
            [parameterIndex]: { type, marker }
        }
    }    
}

export const Body = ParamDec("@Body")
export const Req = ParamDec("@Req")
export const Res = ParamDec("@Res")