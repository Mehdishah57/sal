import { RequestHandler, Router } from "express";

export interface IClasses {
    [key: string]: Function;
}

export interface IControllers {
    [key: string]: {
        router: Router;
        route: string;
    }
}

export interface IApps {
    [key: string]: {
        port: number;
        controllers: {new(...args:any[]):{}}[];
    }
}

export interface IMiddleware {
    [key: string]: {
        [scope: string]: {
            handlers: RequestHandler[];
        }
    }
}

export interface IPendingRegisteration {
   [key: string]: {
        route: string;
        handlerName: string;
        method: "get" | "post" | "delete" | "put" | "patch";
   }[];
}

export interface ILazyPeople {
    [key: string]: {
        classToInjectIn: string;
        property: string;
    }
}

export interface IRequestHandlerParams {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                type: any;
                marker: "@Body" | "@Req" | "@Res"
            }
        }
    }
}

export interface ValidationError {
    target: {new(...args:any[]):{}},
    value: string;
    property: string;
    children: any[],
    constraints: { [key: string]: string }
}

export interface IApp {
    port: number;
    controllers?: {new(...args:any[]):{}}[];
    middlewares?: any[];
}