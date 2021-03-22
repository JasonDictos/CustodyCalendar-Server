FROM node:15-alpine
COPY package.json .
RUN npm set progress=false
RUN npm run build
RUN npm run build
RUN npm install --only=production
COPY ./build ./build
ENTRYPOINT [ "node ./build/portal/server.js" ]
