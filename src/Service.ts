import { container } from "./main";

export const Service = <T extends {new(...args:any[]):{}}>(dependencies?: T[]) => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    if(!container.classes[constructor.name]) {
        container.classes[constructor.name] = constructor;
        if(dependencies?.length) {
            const constructorDeps = dependencies.map(dependency => container.instances[dependency.name]);
            container.instances[constructor.name] = new constructor(...constructorDeps);
        }
        else container.instances[constructor.name] = new constructor();
    }
    return class extends constructor {}
}