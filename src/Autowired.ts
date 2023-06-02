import "reflect-metadata"
import { container } from "./main"

const Autowired = (target: Object, propertyKey: string) => {
    var property = Reflect.getMetadata("design:type", target, propertyKey);
    const targetClass = container.instances[property.name]
    target.constructor.prototype[propertyKey] = targetClass;
}

export default Autowired