import "reflect-metadata"
import express from "express"

export interface IClasses {
    [key: string]: Function;
}

class Container {
    public controllers: IClasses = {}
    public classes: IClasses = {}
    public instances: any = {}
    public app = express()

    constructor() {}
}

export const container = new Container()