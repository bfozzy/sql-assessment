var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    // db.user_create_seed(function(){
    //   console.log("User Table Init");
    // });
    // db.vehicle_create_seed(function(){
    //   console.log("Vehicle Table Init");
    // });
});

// GET ENDPOINTS!!!!!!!!

app.get("/api/users", function(req, res){
  db.get_users(function(err, users){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json(users);
    }
  });
});

app.get("/api/vehicles", function(req, res){
  db.get_vehicles(function(err, vehicles){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json(vehicles);
    }
  });

app.get("/api/user/:userId/vehiclecount", function(req, res){
  db.count_vehicles([req.params.userId], function(err, count){
    var countObject = {
      count: count
    };
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json(countObject);
    }
  });
});

app.get("/api/user/:userId/vehicle", function(req, res){
  db.get_user_vehicles([req.params.userId], function(err, userVehicles){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json(userVehicles);
    }
  });
});

app.get("/api/vehicle", function(req, res){
  if (req.query.UserEmail){
    db.get_vehicles_by_email([req.query.UserEmail], function(err, userVehicles){
      if (err){
        res.status(400).json(err);
      }
      else {
        res.status(200).json(userVehicles);
      }
    });
  }
  else if (req.query.userFirstStart){
    var letters = req.query.userFirstStart + "%";
    db.get_vehicles_by_letters([letters], function(err, userVehicles){
      if (err){
        res.status(400).json(err);
      }
      else {
        res.status(200).json(userVehicles);
      }
    });
  }

});

app.get("/api/newervehiclesbyyear", function(req, res){
  db.get_newer_vehicles(function(err, vehicles){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json(vehicles);
    }
  });
});

  //POST ENDPOINTS!!!!!!!!!!!!!!

  app.post("/api/users", function(req, res){
    db.add_user([req.body.firstname, req.body.lastname, req.body.email], function(err){
      if (err){
        res.status(400).json(err);
      }
      else {
        res.status(200).json("user added");
      }
    });
  });
});

app.post("/api/vehicles", function(req, res){
  db.add_vehicle([req.body.make, req.body.model, req.body.year, req.body.ownerId], function(err){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json("vehicle added");
    }
  });
});

//PUT ENDPOINTS!!!!
app.put("/api/vehicle/:vehicleId/user/:userId", function(req, res){
  db.change_vehicle_owner([req.params.userId, req.params.vehicleId], function(err){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json("ownership changed");
    }
  });
});

//DELETE ENDPOINTS!!!

app.delete("/api/user/:userId/vehicle/:vehicleId", function(req, res){
  db.remove_vehicle_ownership([req.params.vehicleId], function(err){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json("ownership removed");
    }
  });
});

app.delete("/api/vehicle/:vehicleId", function(req, res){
  db.remove_vehicle([req.params.vehicleId], function(err){
    if (err){
      res.status(400).json(err);
    }
    else {
      res.status(200).json("vehicle removed");
    }
  });
});

app.listen('3000', function(){
  console.log("Successfully listening on : 3000");
});

module.exports = app;
