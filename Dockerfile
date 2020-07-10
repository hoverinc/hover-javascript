FROM node:12.18.2-alpine
RUN apk update && apk upgrade && apk add --no-cache git openssh
RUN npm config set unsafe-perm true
