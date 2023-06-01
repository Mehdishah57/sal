import { container } from "./main";

export function Service<T extends {new(...args:any[]):{}}>(constructor: T) {
    if(!container.classes[constructor.name]) {
        container.classes[constructor.name] = constructor;
        const dependencies = container.dependencies[constructor.name];
        console.log(container.classes)
        container.instances[constructor.name] = new constructor("sfas");
    }
    return class extends constructor {}
}