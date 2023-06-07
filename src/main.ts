import "reflect-metadata"
import { Express } from "express"
import { IClasses, IMiddleware, IPendingRegisteration, IRouters, IRoutes } from "./types"

class Container {
    public controllers: IClasses = {}
    public classes: IClasses = {}
    public instances: any = {}
    public routes: IRoutes = {}
    public routers: IRouters = {}
    public middlewares: IMiddleware = {}
    public pendingRegisteration: IPendingRegisteration = {}
    public lazyPeople: any = {}
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
}

export const container = new Container()