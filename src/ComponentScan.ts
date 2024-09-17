import path from "path"
import fs from "fs/promises"

async function scanAndImport(dirPath: string, priorityImports: string[], secondaryImports: string[]): Promise<void> {
    const files = await fs.readdir(dirPath, { withFileTypes: true })
  
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name)
  
      if (file.isDirectory())
        await scanAndImport(fullPath, priorityImports, secondaryImports)

      else if (file.isFile() && /\.(ts|js)$/.test(file.name)) {
        const modulePath = path.resolve(fullPath)
        const content = await fs.readFile(modulePath, "utf-8")
        if(content.includes("container.set")) priorityImports.push(modulePath)
        else if(content.includes("@Controller(")) secondaryImports.push(modulePath)
      }
    }
  }

const ComponentScan = (rootPath: string) => <T extends {new(...args: any[]):{}}>(constructor: T) => {
    const targetPath = path.join(process.cwd(), rootPath)
    const priorityImports: string[] = []
    const secondaryImports: string[] = []
    scanAndImport(targetPath, priorityImports, secondaryImports)
      .then(async() => {
        for(const module of priorityImports) {
          try {
            await import(module);
            console.log(`Imported: ${module}`)
          } catch (error) {
            console.error(`Failed to import: ${module}`, error)
          }
        }

        for(const module of secondaryImports) {
          try {
            await import(module)
            console.log(`Imported: ${module}`)
          } catch (error) {
            console.error(`Failed to import: ${module}`, error)
          }
        }
      })

}

export default ComponentScan
