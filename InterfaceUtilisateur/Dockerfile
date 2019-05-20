FROM node:8

# Create darties directory
WORKDIR /usr/src/darties

RUN npm install express --save
RUN npm install body-parser --save
RUN npm install cookie-parser --save
RUN npm install multer --save

COPY package.json ./
COPY ./common ./common
COPY ./national_dashboard ./national_dashboard
COPY ./server.js .

EXPOSE 8081

CMD [ "npm", "start" ]