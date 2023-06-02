import { container } from "./main"

const Component = <T extends {new(...args: any[]):{}}>(constructor: T) => {
    if(!container.classes[constructor.name]) {
        container.classes[constructor.name] = constructor;
        container.instances[constructor.name] = new constructor();
    }
}

export default Component