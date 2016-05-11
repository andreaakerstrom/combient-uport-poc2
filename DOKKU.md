## Install dokku

```
wget https://raw.githubusercontent.com/dokku/dokku/v0.5.6/bootstrap.sh
sudo DOKKU_TAG=v0.5.6 bash bootstrap.sh
```

#### Go to your browser

http://dokku.uport.me

* Put in the textbox your public key (i.e. `uport.pub`)
* Set the hostname `uport.me`
* Choose the checkbox "Use virtual hosts". So we can use the port `80`.
* Finish Setup

#### Create the app

Inside the server again

```
dokku apps:create testapp
```

That'd be. Enjoy.
