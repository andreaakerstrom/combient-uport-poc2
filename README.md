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

```
git remote add dokku dokku@dokku.uport.me:mapping
git push dokku master
```
