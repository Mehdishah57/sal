import "reflect-metadata"
import express from "express"

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

    constructor() {}
}

export const container = new Container()