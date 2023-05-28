import "reflect-metadata"

class Container {
    public classes: any = {}
    public instances: any = {}
}


function Inject() {}
function Controller() {}
function GetMapping() {}
function PostMapping() {}
function PutMapping() {}
function DeleteMapping() {}

export default new Container()