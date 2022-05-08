const db = require("../util/database");

const ITEMS_PER_PAGE = 2;

exports.home = (req, res, next) => {
  res.render("home");
};
exports.getAddPlant = (req, res, next) => {
  res.render("add");
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
      res.render("add-inventory", {
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

exports.success = (req, res, next) => {
  res.redirect("/");
};

exports.getPlants = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  db.execute("SELECT COUNT(*) AS count FROM inventory_plant")
    .then((result) => {
      totalItems = result[0][0].count;
      let skip = (page - 1) * ITEMS_PER_PAGE;
      return db.execute(
        `SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id LIMIT ${skip} , ${ITEMS_PER_PAGE}`
      );
    })
    .then((products) => {
      res.render("plants", {
        plants: products[0],
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

exports.getManagePlant = (req, res, next) => {
  db.execute("SELECT * FROM plant")
    .then((result) => {
      result = result[0];
      // console.log(result);
      let names = [];
      for (let i = 0; i < result.length; i++) {
        names.push(result[i].scientific_name);
      }
      // console.log(names);
      res.render("manage-plant", {
        plants: names,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditPlant = (req, res, next) => {
  console.log(req.body.p);
  let name = req.body.p;
  db.execute("SELECT * FROM plant where scientific_name = ?", [name])
    .then((result) => {
      info = result[0][0];
      console.log(info);

      res.render("edit-plant", {
        plant: info,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditPlant = (req, res, next) => {
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
    "UPDATE plant SET light = ?, season_of_interest = ?, flower_leaf_interest = ?, pruning = ?, landscape_use = ?, growth_habit = ?" +
      " , soil = ?, category = ?, spread = ?, height = ?, decription= ? WHERE scientific_name = ?",
    [light, sof, fli, pruning, lu, gh, soil, category, spread, height, desc, sn]
  )
    .then(() => {
      console.log("Edited Plant info");
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditInventory = (req, res, next) => {
  const IPID = req.params.plantId;
  console.log("ID = " + IPID);
  db.execute("SELECT * FROM inventory_plant where IPID = ?", [IPID])
    .then((result) => {
      info = result[0][0];
      console.log(info);
      // console.log(result);
      // let names = [];
      // for (let i = 0; i < result.length; i++) {
      //   names.push(result[i].scientific_name);
      // }
      // console.log(names);
      res.render("edit-invent", {
        plant: info,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditInventory = (req, res, next) => {
  const p = req.body.p;
  const name = req.body.name;
  const size = req.body.size;
  const color = req.body.color;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const image = req.file;
  const IPID = req.body.IPID;
  console.log(req.body);
  console.log("IPID = " + IPID);
  console.log(image);
  imageUrl = "";
  if (image) {
    imageUrl = image.path;
    db.execute(
      "UPDATE inventory_plant SET name = ?, size = ?, color = ?, quantity = ?, price = ?, image = ? WHERE IPID = ?",
      [name, size, color, quantity, price, imageUrl, IPID]
    )
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    db.execute(
      "UPDATE inventory_plant SET name = ?, size = ?, color = ?, quantity = ?, price = ? WHERE IPID = ?",
      [name, size, color, quantity, price, IPID]
    )
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
  //handle if no plant match in select input , or use the table in the db
};

exports.getManage = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  db.execute("SELECT COUNT(*) AS count FROM inventory_plant")
    .then((result) => {
      totalItems = result[0][0].count;
      let skip = (page - 1) * ITEMS_PER_PAGE;
      return db.execute(
        `SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id LIMIT ${skip} , ${ITEMS_PER_PAGE}`
      );
    })
    .then((products) => {
      res.render("manage-inventory", {
        plants: products[0],
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
