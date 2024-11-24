import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import { dts } from "rollup-plugin-dts"
import { cleandir } from "rollup-plugin-cleandir"
import os from "node:os"

const typescriptPlugin = typescript()
const terserPlugin = terser({
  maxWorkers: os.cpus().length || 1
})

export default defineConfig([
  {
    input: "index.ts",
    output: [
      {
        file: "dist/index.mjs",
        format: "esm"
      },
      {
        file: "dist/index.cjs",
        format: "cjs",
        exports: "named"
      },
      {
        file: "dist/index.min.js",
        format: "iife",
        name: "ecs",
        exports: "named"
      }
    ],
    plugins: [cleandir("dist"), typescriptPlugin, terserPlugin]
  },
  {
    input: "index.ts",
    output: {
      file: "dist/index.d.ts"
    },
    plugins: [typescriptPlugin, dts()]
  }
])
