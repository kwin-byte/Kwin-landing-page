FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
RUN npm install -g serve@14.2.4
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["sh", "-c", "serve dist -s -l tcp://0.0.0.0:${PORT:-8080}"]
