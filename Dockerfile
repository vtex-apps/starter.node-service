### 1. Installing production dependencies

FROM node:14 AS build-env-modules
# Avoids adding src folder, so docker will use existing cache if nothing changed
COPY package.json yarn.lock /app/
WORKDIR /app
# Ignoring devDependencies for the node_modules that will be added in the production image
RUN yarn install --prod

### 2. Building application (from TypeScript to JavaScript)

FROM node:14 AS build-env-dist
# Avoids adding src folder, so docker will use existing cache if nothing changed
COPY package.json yarn.lock /app/
WORKDIR /app
# Installing devDependencies to build the js files
RUN yarn install

COPY . /app/
RUN yarn build

### 3. Building production image with required files only

# Building the image from distroless to obtain a smaller image for production
FROM gcr.io/distroless/nodejs:14
COPY --from=build-env-modules /app/node_modules /app/node_modules
COPY --from=build-env-dist /app/dist /app/dist
WORKDIR /app
EXPOSE 8080
CMD [ "dist/index.js" ]
