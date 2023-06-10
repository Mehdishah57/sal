import { RequestHandler, Router } from "express";

export interface IClasses {
    [key: string]: Function;
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

export interface ILazyPeople {
    [key: string]: {
        classToInjectIn: string;
        property: string;
    }
}