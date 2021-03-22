FROM node:15-alpine
COPY package.json .
COPY src src
COPY tsconfig.json .
COPY tsconfig.app.json .
RUN npm install
RUN npm run build
ENTRYPOINT [ "node --loader ts-node/esm --experimental-specifier-resolution=node ./build/portal/server.js" ]
