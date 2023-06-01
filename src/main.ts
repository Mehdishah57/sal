import "reflect-metadata"
import express, { json } from "express"

export interface IClasses {
    [key: string]: Function;
}

export interface IDependencies {
    [key: string]: string[];
}

class Container {
    public controllers: IClasses = {}
    public classes: IClasses = {}
    public instances: any = {}
    public dependencies: IDependencies = {}
    public app = express()

    constructor() {
        this.app.use(json())
    }
}

export const container = new Container()