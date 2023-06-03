import { container } from "./main"

const Patch = (route = "") => (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Add route with handler to pending registration list against constructor name
    if(!container.pendingRegisteration[target.constructor.name]) container.pendingRegisteration[target.constructor.name] = [];
    container.pendingRegisteration[target.constructor.name].push({
        route,
        handlerName: propertyKey,
        method: "patch"
    });

}

export default Patch