import { container } from "./main";

export const Service = <T extends {new(...args:any[]):{}}>(dependencies?: T[]) => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    if(!container.classes[constructor.name]) {
        container.classes[constructor.name] = constructor;
        if(dependencies?.length) {
            container.instances[constructor.name] = new constructor(...dependencies.map(dependency => new dependency()));
        }
        else container.instances[constructor.name] = new constructor();
    }
    return class extends constructor {}
}