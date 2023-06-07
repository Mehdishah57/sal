import "reflect-metadata"
import { Express } from "express"
import { IClasses, ILazyPeople, IMiddleware, IPendingRegisteration, IRouters, IRoutes } from "./types"

class Container {
    public controllers: IClasses = {}
    public classes: IClasses = {}
    public instances: any = {}
    public routes: IRoutes = {}
    public routers: IRouters = {}
    public middlewares: IMiddleware = {}
    public pendingRegisteration: IPendingRegisteration = {}
    public lazyPeople: ILazyPeople = {}
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
}

export const container = new Container()