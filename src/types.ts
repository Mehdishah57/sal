import { RequestHandler, Router } from "express";

export interface IClasses {
    [key: string]: Function;
}

export interface IRoutes {
    [key: string]: string;
}

export interface IRouters {
    [key: string]: Router;
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