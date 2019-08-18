Wasm Emscripten is from [https://github.com/GoogleChromeLabs/squoosh/](Google Sqoosh).
Web assembly is running within Web Worker, folder name is image-processing-worker.

First step, build Web Worker and wasm-emscripten (instruction below). This will copy the result to static/ folder.

``` 
npm run build
```

Since Sapper is doing Server-side-rendering (SSR) the Emscripten code has issue running. It references fs library (require('fs')) which should have failed (and logic gets handled properly) but it does not. This leads to another issue with webpack.

To run project

```
npm run dev
```

To preview build

```
npm run build
npm run start
```