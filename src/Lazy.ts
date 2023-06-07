import { container } from "./main";

const Lazy = (type: string) => (target: Object, propertyKey: string) => {
    container.lazyPeople[type] = { ...container.lazyPeople, classToInjectIn: target.constructor.name, property: propertyKey }
    target.constructor.prototype[propertyKey] = undefined;
}

export default Lazy