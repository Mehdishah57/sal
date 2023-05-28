import container from "./main"

export function Autowired<T extends {new(...args:any[]):{}}>(constructor: T) {
    if(!container.classes[constructor.name]) {
        container.classes[constructor.name] = constructor;
    }
    return class extends constructor {
        
    }
}
