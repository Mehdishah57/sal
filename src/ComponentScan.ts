import path from "path"
import fs from "fs/promises"

async function scanAndImport(dirPath: string): Promise<void> {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
  
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
  
      if (file.isDirectory()) {
        // Recursively scan subdirectories
        await scanAndImport(fullPath);
      } else if (file.isFile() && /\.(ts|js)$/.test(file.name)) {
        // Dynamically import the .ts or .js file
        const modulePath = path.resolve(fullPath);
        try {
          await import(modulePath);
          console.log(`Imported: ${modulePath}`);
        } catch (err) {
          console.error(`Failed to import: ${modulePath}`, err);
        }
      }
    }
  }

const ComponentScan = (rootPath: string) => <T extends {new(...args: any[]):{}}>(constructor: T) => {
    const targetPath = path.join(process.cwd(), rootPath)
    scanAndImport(targetPath)
}

export default ComponentScan
