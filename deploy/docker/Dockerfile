ARG NODE_VERSION
ARG NGINX_VERSION
FROM node:${NODE_VERSION} AS builder

ARG NUXT_ENV_API_URL
ENV NUXT_ENV_API_URL ${NUXT_ENV_API_URL}
WORKDIR /app

RUN apk add python3 make g++ autoconf automake libtool file pkgconf build-base alpine-sdk nasm
# Copy and build the application
COPY . .
RUN yarn
ARG NODE_ENV=development
ENV NODE_ENV ${NODE_ENV}
RUN yarn generate

### Second stage
FROM nginx:${NGINX_VERSION}
COPY --from=builder /app/dist/ /var/www/dev-frontend
COPY --from=builder /app/deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
