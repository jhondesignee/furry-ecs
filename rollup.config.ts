import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import { dts } from "rollup-plugin-dts"
import os from "node:os"

export default defineConfig([
  {
    input: "index.ts",
    output: {
      dir: "dist",
      format: "es"
    },
    plugins: [
      typescript(),
      terser({
        maxWorkers: os.cpus().length || 1
      })
    ]
  },
  {
    input: "index.d.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es"
    },
    plugins: [dts()]
  }
])
