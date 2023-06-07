import { container } from "./main"

const Component = <T extends {new(...args: any[]):{}}>(constructor: T) => {
    // Register a class as Component if its not already present
    if(!container.classes[constructor.name]) {
        // Store bare constructor in classes
        container.classes[constructor.name] = constructor;
        
        // Store instance of class in instances
        container.instances[constructor.name] = new constructor();

        // Check if this should be lazily injected to some other class
        const lazyInjectable = container.lazyPeople[constructor.name]
        if(!lazyInjectable) return;

        // Get instance of classes to inject inside
        const injectable = container.instances[lazyInjectable.classToInjectIn];

        // Inject the instance into property in target class
        injectable[lazyInjectable.property] = container.instances[constructor.name];
    }
}

export default Component