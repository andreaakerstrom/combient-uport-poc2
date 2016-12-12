FROM node:wheezy

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Add github key for npm install from github
RUN mkdir /root/.ssh/
RUN touch /root/.ssh/known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Add uportdummy2 file
ADD uportdummy2 /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa

# Bundle app source
COPY . /usr/src/app
RUN rm -rf /usr/src/app/node_modules && \
    npm install

EXPOSE 3000
ENV PORT=3000
CMD [ "npm", "start" ]
