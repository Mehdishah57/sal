import express from "express"
import { container } from "./main"

const Controller = (route: string) => <T extends {new(...args:any[]):{}}>(constructor: T) => {}

export default Controller