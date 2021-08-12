# Node Service Starter for VTEX IO apps

This repository is used to generate a boilerplate to implement a [VTEX IO](https://developers.vtex.com/vtex-developer-docs/docs/welcome) service with [Node.js](https://nodejs.org/) HTTP handler.

## How to use it

> :warning: `vtex init` is not integrated with this template yet. Meanwhile, you can download the code directly from the repository

1. [Install VTEX IO CLI](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-install)
2. Run the command `vtex init` to create an app, and follow the instructions to add a Node.js service in the app

It will create a project folder for the new app and add the Node.js service into it. Once the service is created, you can modifying it as you like.

## How does it work

VTEX IO runs the service as a container. A `Dockerfile` to build the container image is provided by the starter, and it will be used by VTEX IO engine to build the image.

You can modify anything that is provided by default in the boilerplate, including the Dockerfile.

## Features

The generated boilerplate comes with best practices for creating VTEX IO Node.js services:

- HTTP server using [Koa](https://koajs.com/)
  - A few useful Koa middlewares are added by default. You can see them [here](https://github.com/vtex-apps/starter.node-service/blob/main/src/index.ts).
- Local development and testing
- [Useful yarn scripts](#scripts) to develop and test your service
- A sample route for REST requets
- A sample route for [graphql](https://graphql.org/) requests
- Tests using [Jest](https://jestjs.io/)
- TypeScript setup using [default VTEX configuration](https://github.com/vtex/typescript/tree/main/packages/tsconfig)
- Linter using [eslint](https://eslint.org/) with [default VTEX configuration](https://github.com/vtex/typescript/blob/main/packages/eslint-config-vtex/README.md)
- Automatically formats staged files before `git commit`
- Code formatting using default [Prettier](https://prettier.io/) with [default VTEX configuration](https://github.com/vtex/typescript/tree/main/packages/prettier-config)

## Scripts

Following scripts are available to be used with [yarn](https://classic.yarnpkg.com/en/docs/install/):

- `yarn build` - Builds the service generating final files in the `dist` folder. This will use `tsc` to convert the `TypeScript` files to pure `JavaScript`
- `yarn start` - Builds the service and start it on `localhost` in `prodution` mode
- `yarn dev` - Builds the service and start it service on `localhost` in `development` mode
- `yarn watch` - Starts the service on `localhost` with [nodemon](https://github.com/remy/nodemon) and [ts-node](https://typestrong.org/ts-node/), and automatically restarts the server when `src` files are changed
- `yarn debug` - Starts the service on `localhost` ready for debugging the execution
- `yarn test` - Runs tests from `src/__tests__` with `jest`
- `yarn lint` - Lints and formats the code

## Recipes

`// TODO`

## Telemetry

`// TODO`
