Palomas
=======

A decentralized network for carrying messages from / to disconnected communities.

Raspberry Pi Installation
=========================

Requirements
------------

The device should be enabled as a WIFI access point, running the web server on
localhost for capturing messages from un-connected communities

Raspberry Pi 3

1. Raspbian (Jessie Lite)
2. NodeJS v8
3. MongoDB
8. Git
6. NGINX
7. Palomas-server
4. Self-signed SSL
5. Access point
7. host <your.domain>

Setup Instructions
------------------

Install MongoDB

```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install mongodb-server
```

* `sudo mkdir -p /data/db`

Upgrade major version of node
http://thisdavej.com/upgrading-to-more-recent-versions-of-node-js-on-the-raspberry-pi/

* Reboot??

Add as service `sudo service mongod start`

Access Point

[instructions](https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md)

Configure domain

`sudo nano /etc/dnsmasq.conf`
`domain=<your.domain>`

`sudo nano /etc/hosts`
`192.168.0.1     <your.domain>`

Install NodeJS

```
sudo apt-get install git
git clone https://github.com/audstanley/NodeJs-Raspberry-Pi
cd NodeJs-Raspberry-Pi
chmod +x Install-Node.sh
sudo ./Install-Node.sh
cd .. && rm -R -f NodeJs-Raspberry-Pi/
node -v
```

`sudo npm install -g pm2`

Install NGINX

`sudo apt-get install nginx`

`sudo nano /etc/nginx/sites-enabled/default`

https://github.com/AravindNico/Nodejs-Express-blog-series/blob/master/nginxApp/nginxConfig/default

Configure to allow both http and https for the server.

```
server_name <your.domain>;

location / {
  # Palomas configuration
  proxy_pass http://127.0.0.1:8080;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

Clone project

`npm install --production`

Create a `.env` file in the project root and add the following
```
NODE_ENV=offgrid
MONGO_URL=mongodb://localhost/palomas
PORT=8080
AP_ID=000002
```

SSL Provisioning

Self-signing SSL for NGINX
https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04

piControl
https://github.com/saturngod/piControl

Run app as a service with pm2
-----------------------------

http://pm2.keymetrics.io/docs/usage/startup/

Contributing
------------

Clone project and run `npm install`

Client development
* For client development run `npm run front-dev`
* To build client `npm run front-build`

Server development
* Create `.env` file in root directory, should contain `MONGO_URL=mongodb://localhost/palomas`
* For server development run `npm start` or `nodemon index`
* For server test suite run `npm test`

TODOs
-----

[ ] PGP encryption for packages
[ ] Figure out account scheme for private conversations

Contributors
------------

* Joel Martínez [@j0x0j](https://github.com)
* Luis Roca [@rocaiguina](https://github.com)

Made with ❤️ in San Juan 🇵🇷

https://medium.com/read-write-participate/20-big-ideas-to-connect-the-unconnected-88cb1a46ad2
