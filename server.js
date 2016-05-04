var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
    loki = require("lokijs");



var db = new loki("db.json");
var resourceCollection = db.addCollection("resouces");
loadResources(resourceCollection)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/resources', function(req, res) {
   res.send(resourceCollection.data);
});

app.use(router);

app.listen(3000, function() {
  console.log("Mapping server running on http://localhost:3000");
});


function loadResources(_collection){

}


function addResource(_index,_collection){
		_collection.insert(resourceObj);
}
