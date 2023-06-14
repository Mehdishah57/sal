import "reflect-metadata"
import { Express } from "express"
import { IClasses, ILazyPeople, IMiddleware, IPendingRegisteration, IRequestHandlerParams, IRouters } from "./types"

class Container {
    public classes: IClasses = {}
    public instances: any = {}
    public routers: IRouters = {}
    public middlewares: IMiddleware = {}
    public pendingRegisteration: IPendingRegisteration = {}
    public lazyPeople: ILazyPeople = {}
    public requestHandlerParams: IRequestHandlerParams = {}
    public validate: any = (instance: any) => {}
    private _app: Express;

    public set app(theApp: Express) {
        this._app = theApp
    }

    public get app() {
        return this._app
    }

    constructor(app?: Express) {
        this.app = app;
    }

    public set<T extends {new(...args:any[]):{}}>(constructor: T, instance: Object) {
        this.classes[constructor.name] = constructor
        this.instances[constructor.name] = instance
    }

    public get<T>(classType: { new (): T }): T {
        return this.instances[classType?.name]
    }
}

export const container = new Container()