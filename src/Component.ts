import { container } from "./main"

const Component = <T extends {new(...args: any[]):{}}>(constructor: T) => {
    // Register a class as Component if its not already present
    if(!container.classes[constructor.name]) {
        // Store bare constructor in classes
        container.classes[constructor.name] = constructor;
        
        // Store instance of class in instances
        container.instances[constructor.name] = new constructor();
    }
}

export default Component