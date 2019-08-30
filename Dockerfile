FROM node:10.16.0-alpine
RUN apk update && apk upgrade && apk add --no-cache git openssh
RUN npm config set unsafe-perm true
