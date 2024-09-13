import ComponentScan from "./ComponentScan"
import { container } from "./main"
import { IApp } from "./types"

const App = ({ port, middlewares, appRootPath = "src" }: IApp) => <T extends {new(...args:any[]):{}}>(constructor: T) => {
    ComponentScan(appRootPath)(constructor)

    /* Attach Middlewares from outside */
    middlewares?.forEach(middleware => container.app.use(middleware))
    
    /* Starting Express application on given port */
    const server = container.app.listen(port, () => console.log(`${constructor.name} started at ${port}`))

    /* Saving useful properties in container for later access */
    container.server = server
}

export default App