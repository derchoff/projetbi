FROM node:8

# Create darties directory
WORKDIR /usr/src/darties

RUN npm install express --save
RUN npm install body-parser --save
RUN npm install cookie-parser --save
RUN npm install multer --save
RUN npm install mysql --save

COPY package.json ./
COPY ./common ./common
COPY ./dashboard ./dashboard
COPY ./server.js .
COPY ./login.js .
COPY ./lastupdate.js .
COPY ./regionlist.js .

EXPOSE 8081

CMD [ "npm", "start" ]