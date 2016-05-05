# uport-connect-mapping
Mapping Server for uPort Connect

## Expected Usage

- uPort-enabled app generates a random ID (ie: 1234-5678-9082)
- uPort-enabled app show the user a QR with URL: https://mapping.uport.me/map/{randomId}
- uPort-enabled app polls (GET) https://mapping.uport.me/map/{randomId} , waits for `address` field.

- uPort Mobile app scans URL from QR code
- uPort do a POST to the URL https://mapping.uport.me/map/{randomId} (scanned URL) with `{"address": "<address>"}` as body parameter


- uPort-enabled app gets the {address} and delete the id from the mapping server with `DELETE https://mapping.uport.me/map/{randomId}`


## API
### GET Address by ID

`GET /map/:id`

Id is not in the in-memory database it will create a new record.

### POST Address

`POST /map/:id`

Headers:
```
Content-Type: application/json
```

Params:
```
{
  "address": "0xaddr12312"
}

```

### DELETE Address
`DELETE /map/:id`

## Dokku Deploying

### Setup Your Machine

```
eval `ssh-agent -s`
ssh-add uport # <--- The route to your uport key

git remote add dokku dokku@mapping.uport.me:mapping
git push dokku master
```

### Test

```
curl http://mapping.uport.me/map/77777; echo
```

Shold give you something like

```
{"id":"77777","meta":{"revision":0,"created":1462476068378,"version":0},"$loki":1}
```

### Oh no! I broke the server. Quick, how do I configure dokku in a server again?

In a fresh machine

#### Install dokku

```
wget https://raw.githubusercontent.com/dokku/dokku/v0.5.6/bootstrap.sh
sudo DOKKU_TAG=v0.5.6 bash bootstrap.sh
```

#### Go to your browser

http://mapping.uport.me

* Put in the textbox your public key (i.e. `uport.pub`)
* Set the hostname `uport.me`
* Choose the checkbox "Use virtual hosts". So we can use the port `80`.
* Finish Setup

#### Create the app

Inside the server again

```
dokku apps:create mapping
```

That's be. Enjoy.
