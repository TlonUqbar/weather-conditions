# 🚀 Welcome to your new awesome project!

This is a javascript started template repo.
At the moment this is pretty bare bones.
I've only configured prettier, eslint, webpack, and gp-pages.



## Prettier

### Running Prettier from VSCode 
If this was properly configured it will automatically run on save.
Open the "Output" tab in the console and select Prettier to see the results.

But you can manually run it to format a chunk of code like this:

```
1. CMD + Shift + P -> Format Document
OR
1. Select the text you want to Prettify
2. CMD + Shift + P -> Format Selection
```


### Running Prettier from Terminal
```bash
npx prettier . --check     // find errors
npx prettier . --write     // find and fix
```

### Running Prettier from Terminal with `npm scripts`
The following npm scripts are available
```bash
  npm run prettier         // find errors
  npm run prettier:fix     // find and fix
```

## ESLint

### ESLint in VSCode 
If this was properly setup, the linter should be automatically working and linting.
Open the "Output" tab in the console and select ESLint to see the results.

The default mode is to lint as you type.
The other mode to is to lint on save.


### Running Prettier from Terminal
```bash
eslint  source-file       // find errors
eslint --fix source-file  // find and fix
```


### Running ESLint from Terminal with `npm scripts`
The following npm scripts are available
```bash
npm run lint              //  find errors
npm run lint:fix          //  find and fix
```


## Webpack

Webpack is installed and configured to run in prod and dev modes.

```bash
    npm run build       // production mode, generates new 'dist' files
    npm run build:dev   // development mode, uses source files, watch and dev-server enabled
    npm run build:prod  // production mode 
    npn run watch       // watch for file changes
    npm run serve       // serve files with dev server 
```



## Deploying to Github Pages

The npm package `gh-pages` installed and the following `npm scripts` are available.
```bash
    npm run gh-pages-init     //  initialize repo to use gh-pages
    npm run predeploy         //  runs build distribution sources
    npm run deploy            //  runs gh-pages -d dist  
```
