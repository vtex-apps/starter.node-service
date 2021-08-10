FROM node:14 AS build-env-modules
ADD . /app
WORKDIR /app
# Ignoring devDependencies for the node_modules that will be added in the production image
RUN yarn install --prod

FROM node:14 AS build-env-dist
ADD . /app
WORKDIR /app
# Installing devDependencies to build the js files
RUN yarn install
RUN yarn build

# Building the image from distroless to obtain a smaller image for production
# FROM gcr.io/distroless/nodejs:14
FROM node:14
COPY --from=build-env-modules /app/node_modules /app/node_modules
COPY --from=build-env-dist /app/dist /app/dist
WORKDIR /app
EXPOSE 8080
CMD [ "node",  "./dist/index.js" ]
