const db = require("../util/database");

exports.getAddPlant = (req, res, next) => {
  res.render("manage");
};

exports.postAddPlant = (req, res, next) => {
  console.log(req.body);
  const light = req.body.light;
  const sof = req.body.sof;
  const fli = req.body.fli;
  const pruning = req.body.pruning;
  const lu = req.body.lu;
  const gh = req.body.gh;
  const sn = req.body.sn;
  const soil = req.body.soil;
  const category = req.body.category;
  const spread = req.body.spread;
  const height = req.body.height;
  const desc = req.body.desc;
 
  db.execute(
    "INSERT INTO plant(light , season_of_interest , flower_leaf_interest , pruning , landscape_use , growth_habit , scientific_name " +
      " , soil , category , spread , height , decription) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    [light, sof, fli, pruning, lu, gh, sn, soil, category, spread, height, desc]
  )
    .then(() => {
      console.log("Created Product");
      res.redirect("/add-plant");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
     
    });
};

exports.getAddInventory = (req, res, next) => {
  db.execute("SELECT * FROM plant")
    .then((result) => {
      result = result[0];
      // console.log(result);
      let names = [];
      for (let i = 0; i < result.length; i++) {
        names.push(result[i].scientific_name);
      }
      // console.log(names);
      res.render("inventory", {
        plants: names,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddInventory = (req, res, next) => {
  console.log(req.body);
  const p = req.body.p;
  const name = req.body.name;
  const size = req.body.size;
  const color = req.body.color;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const image = req.file;
  console.log(image);
  imageUrl = image.path;
  console.log(image, imageUrl);
  //handle if no plant match in select input , or use the table in the db
  db.execute("SELECT scientific_name FROM plant WHERE scientific_name = ?", [
    p,
  ]).then((myResult) => {
    id = myResult[0][0].scientific_name;
    db.execute(
      "INSERT INTO inventory_plant(plant_id, name, size, color, quantity, price, image) VALUES(?,?,?,?,?,?,?)",
      [id, name, size, color, quantity, price, imageUrl]
    )
      .then(() => {
        console.log("Created Product");
        res.redirect("/add-inventory");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getPlants = (req, res, next) => {
  db.execute(
    "SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id"
  )
    .then((result) => {
      plantsArr = result[0];
      res.render("plants", {
        plants: plantsArr,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.details = (req, res, next) => {
  const plantId = req.params.plantId;
  db.execute(
    "SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id and IPID = ?",
    [plantId]
  )
    .then((result) => {
      myPlant = result[0][0];
      console.log(myPlant);
      res.render("plant-detail", {
        plant: myPlant,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
