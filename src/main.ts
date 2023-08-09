import "reflect-metadata"
import { IApps, IClasses, IControllers, ILazyPeople, IMiddleware, IPendingRegisteration, IRequestHandlerParams } from "./types"

class Container {
    public classes: IClasses = {}
    public instances: any = {}
    public controllers: IControllers = {}
    public middlewares: IMiddleware = {}
    public pendingRegisteration: IPendingRegisteration = {}
    public lazyPeople: ILazyPeople = {}
    public requestHandlerParams: IRequestHandlerParams = {}
    public validate: any = (instance: any) => {}
    public apps: IApps = {};

    public set<T extends {new(...args:any[]):{}}>(constructor: T, instance: Object) {
        this.classes[constructor.name] = constructor
        this.instances[constructor.name] = instance
    }

    public get<T>(classType: { new (): T }): T {
        return this.instances[classType?.name]
    }
}

export const container = new Container()