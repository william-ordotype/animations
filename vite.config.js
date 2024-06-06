import { defineConfig } from 'vite'
import * as path from "path";
import * as fs from "fs";

// Directory containing the source files
const srcDir = path.resolve(__dirname, 'src');

// Read all files from the src directory
const files = fs.readdirSync(srcDir);

// Create the input object
const input = files.reduce((acc, file) => {
    const name = path.basename(file, '.js');
    acc[name] = path.resolve(srcDir, file);
    return acc;
}, {});

export default defineConfig({
    build: {
        rollupOptions: {
            input,
            output: {
                entryFileNames: "[name].js",
                assetFileNames: "[name].[ext]",
            }
        },
    },
})