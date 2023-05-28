import "reflect-metadata"

class Container {
    public classes: any = {}
    public instances: any = {}
}

export const container = new Container()