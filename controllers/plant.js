const db = require("../util/database");

const ITEMS_PER_PAGE = 2;

exports.home = (req, res, next) => {
  res.render("home");
};
exports.getAddPlant = (req, res, next) => {
  res.render("add");
};

exports.postAddPlant = async(req, res, next) => {
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

   await db.execute(
    "INSERT INTO plant(scientific_name ,light , season_of_interest , flower_leaf_interest , pruning , landscape_use , growth_habit " +
      " , soil , category , spread , height , decription) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    [sn,light, sof, fli, pruning, lu, gh,  soil, category, spread, height, desc]
  )
    .then(() => {
      res.redirect("/add-plant");
    })
    .catch((err) => {

      res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
     
    });
};

exports.getAddInventory =async (req, res, next) => {
  try{
  await db.execute("SELECT * FROM plant")
    .then((result) => {
      result = result[0];
      let names = [];
      for (let i = 0; i < result.length; i++) {
        names.push(result[i].scientific_name);
      }
      res.render("add-inventory", {
        plants: names,
      });
    })
    }catch(err)  {
      res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    };
};


exports.postfilterByCatgory =async (req, res, next) => {
  
  const category=req.body.catg;
  console.log('welcom');
  console.log(req.body);
  const page = +req.query.page || 1;
  let totalItems;
if (category=="") {
  
}else{
  db.execute("SELECT COUNT(*) AS count FROM inventory_plant")
    .then((result) => {
      totalItems = result[0][0].count;
      let skip = (page - 1) * ITEMS_PER_PAGE;
      return db.execute(
        `SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id and p.category=? LIMIT ${skip} , ${ITEMS_PER_PAGE}`
      ,[category]);
    })
    .then((products) => {
      if(products[0].length>0){
      console.log(products[0]);
      res.render("plants", {
        plants: products[0],
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });}
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
       next(error);
    });}
};

exports.details = async(req, res, next) => {
  const plantId = req.params.plantId;
  try{
  await db.execute(
    "SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id and IPID = ?",
    [plantId]
  )
    .then((result) => {
      myPlant = result[0][0];
      res.render("plant-detail", {
        plant: myPlant,
      });
    })
  }catch(err)  {
    res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    };
};
exports.postAddInventory =  async(req, res, next) => {
  const p = req.body.p;
  const name = req.body.name;
  const size = req.body.size;
  const color = req.body.color;
  const quantity = req.body.quantity;
  const price = req.body.price;
  let image = req.file;

  if (req.file==undefined) {
    imageUrl="";  

  }else{
    imageUrl = image.path;

  }
  
  //handle if no plant match in select input , or use the table in the db
  try{
   await db.execute("SELECT scientific_name FROM plant WHERE scientific_name = ?", [
    p,
  ]).then((myResult) => {
    id = myResult[0][0].scientific_name;
   db.execute(
      "INSERT INTO inventory_plant(plant_id, name, size, color, quantity, price, image) VALUES(?,?,?,?,?,?,?)",
      [id, name, size, color, quantity, price, imageUrl]
    )
      .then(() => {
        res.redirect("/add-inventory");
      })
      
  })}catch(err) {
    res.status(500);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  };
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

exports.details = async(req, res, next) => {
  const plantId = req.params.plantId;
  try{
  await db.execute(
    "SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id and IPID = ?",
    [plantId]
  )
    .then((result) => {
      myPlant = result[0][0];
      res.render("plant-detail", {
        plant: myPlant,
      });
    })
  }catch(err)  {
    res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    };
};
exports.getInventory= async (req, res, next) => {
  db.execute("SELECT * FROM wahah.inventory_plant").then(result=>{
    console.log(result[0]);
    res.render("inventory", {
      inventory: result[0],
    }).catch(err=>{
      res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
};
exports.getManagePlant = async(req, res, next) => {
  try{
  await db.execute("SELECT * FROM plant")
    .then((result) => {
      result = result[0];
      let names = [];
      for (let i = 0; i < result.length; i++) {
        names.push(result[i].scientific_name);
      }
      res.render("manage-plant", {
        plants: names,
      });
    })
  }catch(err)  {
      res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    };
};

exports.getEditPlant = async (req, res, next) => {
  let name = req.body.p;
   await db.execute("SELECT * FROM plant where scientific_name = ?", [name])
    .then((result) => {
      info = result[0][0];

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

exports.postEditPlant = async(req, res, next) => {
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
try{
  await db.execute(
    "UPDATE plant SET light = ?, season_of_interest = ?, flower_leaf_interest = ?, pruning = ?, landscape_use = ?, growth_habit = ?" +
      " , soil = ?, category = ?, spread = ?, height = ?, decription= ? WHERE scientific_name = ?",
    [light, sof, fli, pruning, lu, gh, soil, category, spread, height, desc, sn]
  )
    .then(() => {
      res.redirect("/");
    })
  }catch(err)  {
      res.status(500);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    };
};

exports.getEditInventory = (req, res, next) => {
  const IPID = req.params.plantId;
  db.execute("SELECT * FROM inventory_plant where IPID = ?", [IPID])
    .then((result) => {
      info = result[0][0];
      // let names = [];
      // for (let i = 0; i < result.length; i++) {
      //   names.push(result[i].scientific_name);
      // }
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

exports.postEditInventory = async (req, res, next) => {
  const p = req.body.p;
  const name = req.body.name;
  const size = req.body.size;
  const color = req.body.color;
  const quantity = req.body.quantity;
  const price = req.body.price;
  const image = req.file;
  const IPID = req.body.IPID;
 
  imageUrl = "";
  if (image) {
    imageUrl = image.path;
    try{
   await db.execute(
      "UPDATE inventory_plant SET name = ?, size = ?, color = ?, quantity = ?, price = ?, image = ? WHERE IPID = ?",
      [name, size, color, quantity, price, imageUrl, IPID]
    )
      .then(() => {
        res.redirect("/");
      })
    }catch(err) {
      res.status(500);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      };
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
