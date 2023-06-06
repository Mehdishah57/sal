import { container } from "./main";

const Lazy = (type: string) => (target: Object, propertyKey: string) => {
    const instance = container.instances[type]
    if(!instance) setTimeout(() => Lazy(type)(target, propertyKey), 1000);
    else {
        target.constructor.prototype[propertyKey] = instance;
    }
}

export default Lazy