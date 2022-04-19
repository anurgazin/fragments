FROM node:16.14-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b AS dependencies

ENV NODE_ENV=production

LABEL maintainer="Aldiyar Nurgazin <anurgazin@myseneca.ca>"
LABEL description="Fragments-Ui service"

WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install node dependencies defined in package-lock.json
# STEP 20: Installing only production dependencies 
RUN npm ci --only=production


USER node

#######################################################################

# Stage 1: use dependencies to build the site
FROM node:16.14-alpine@sha256:2c6c59cf4d34d4f937ddfcf33bab9d8bbad8658d1b9de7b97622566a52167f2b AS builder

WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app

COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Copy source code into the image
COPY . .


# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080

########################################################################
