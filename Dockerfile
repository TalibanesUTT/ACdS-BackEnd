FROM node:hydrogen-alpine as build

WORKDIR /app

# Install git and other dependencies
RUN apk add --no-cache git

# Install NestJS CLI globally
RUN npm i -g @nestjs/cli

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

RUN addgroup -S nestjs && adduser -S nestjs -G node
# Copy the rest of your app's source code from your host to your image filesystem.
COPY --chown=nestjs . .


# Create a new user "nestjs" and add user to "node" group

# Set the default shell for the "nestjs" user
RUN echo "nestjs ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    sed -i 's;^nestjs:x:[^:]*:[^:]*:[^:]*:/home/nestjs:/sbin/nologin;nestjs:x:\1:\2:\3:/home/nestjs:/bin/sh;' /etc/passwd

# Switch to "nestjs" user
USER nestjs

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "run", "start:debug"]
