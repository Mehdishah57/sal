import { container } from "./main";

const express = () => container.app;

export {
    container,
    express
}