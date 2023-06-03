import "reflect-metadata"
import express from "express"
import { IClasses, IPendingRegisteration, IRouters, IRoutes } from "./types"

class Container {
    public controllers: IClasses = {}
    public classes: IClasses = {}
    public instances: any = {}
    public routes: IRoutes = {}
    public routers: IRouters = {}
    public pendingRegisteration: IPendingRegisteration = {}
    public app = express()

    constructor() {}
}

export const container = new Container()