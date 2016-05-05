var express = require("express"),
    cors = require("cors"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    loki = require("lokijs");



var db = new loki("db.json");
var addrCollection = db.addCollection("addresses",{
    unique: ['id']
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/map/:id', function(req, res) {
  var id = req.params.id;
  console.log("GET /map/"+id);
  var r=addrCollection.by("id",id);
  if(r == undefined){
    console.log("NEW id!");
    r={
      id: id
    }
    addrCollection.insert(r);
  }
  console.log(r);
  res.send(r);
});

router.post('/map/:id', function(req, res) {
  var id = req.params.id;
  console.log("POST /map/"+id);
  var r=addrCollection.by("id",id);
  if(r == undefined){
    res.status(404).send(id+" not found!");
  }else{
    console.log(r);
    var address = req.body.address;
    r.address=address;
    console.log(r);
    addrCollection.update(r);
    res.send("Updated!");
  }
});

router.delete('/map/:id', function(req, res) {
  var id = req.params.id;
  console.log("DELETE /map/"+id);
  var r=addrCollection.by("id",id);
  if(r == undefined){
    res.status(404).send(id+" not found!");
  }else{
    addrCollection.remove(r);
    res.send("Deleted!");
  }
});

app.use(router);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log("Mapping server running on http://localhost:"+app.get('port'));
});
