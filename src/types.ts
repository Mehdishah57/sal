import { Router } from "express";

export interface IClasses {
    [key: string]: Function;
}

export interface IRoutes {
    [key: string]: string;
}

export interface IRouters {
    [key: string]: Router;
}

export interface IPendingRegisteration {
   [key: string]: {
        route: string;
        handlerName: string;
        method: "get" | "post" | "delete" | "put" | "patch";
   }[];
}