import "reflect-metadata"
import { Express } from "express"
import { IClasses, IPendingRegisteration, IRouters, IRoutes } from "./types"

class Container {
    public controllers: IClasses = {}
    public classes: IClasses = {}
    public instances: any = {}
    public routes: IRoutes = {}
    public routers: IRouters = {}
    public pendingRegisteration: IPendingRegisteration = {}
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