// scripts/rename_chunks.js
import fs from "fs";
import path from "path";

const buildDir = "./dist/assets/"; // Change this to your build directory

function renameChunks(name, newName) {
  fs.readdirSync(buildDir).forEach((file) => {
    if (file.includes(name)) {
      const oldFilePath = path.join(buildDir, file);
      const newFileName = file.replace(name, newName);
      const newFilePath = path.join(buildDir, newFileName);
      fs.renameSync(oldFilePath, newFilePath);
      console.log(`Renamed ${file} to ${newFileName}`);
    }
  });
}

// Extract command line arguments
const [name, newName] = process.argv.slice(2);

renameChunks(name, newName);
