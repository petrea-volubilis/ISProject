const db = require("../util/database");

const Todo = require("../models/Todo");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
// const { post } = require("../routes/plant");

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
  // console.log(image);
  imageUrl = image.path;
  // console.log(image, imageUrl);
  //handle if no plant match in select input , or use the table in the db
  db.execute("SELECT scientific_name FROM plant WHERE scientific_name = ?", [
    p,
  ]).then((myResult) => {
    id = myResult[0][0].scientific_name;
    db.execute(
      "INSERT INTO inventory_plant(plant_id, name, size, color, quantity, price, image, active) VALUES(?,?,?,?,?,?,?,?)",
      [id, name, size, color, quantity, price, imageUrl, "t"]
    )
      .then(() => {
        console.log("fdg2");

        console.log("Created Product");
        res.redirect("/plants");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.postDeleteInventory = (req, res, next) => {
  const name = req.body.plant;
  db.execute("UPDATE inventory_plant SET active = ? WHERE name = ?", [
    "f",
    name,
  ])
    .then(() => {
      res.redirect("/plants");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteInventory = (req, res, next) => {
  res.render("delete-plant");
};

exports.success = (req, res, next) => {
  res.redirect("/");
};

exports.filterByCategory = (req, res, next) => {
  const category = req.body.category;
  const page = +req.query.page || 1;
  let totalItems;

  db.execute(
    "SELECT COUNT(*) as count FROM plant p , inventory_plant ip where quantity > ? AND category = ? AND ip.active = ? AND p.scientific_name = ip.plant_id",
    ["t", category, 0]
  )
    .then((result) => {
      totalItems = result[0][0].count;
      let skip = (page - 1) * ITEMS_PER_PAGE;
      return db.execute(
        `SELECT * FROM plant p , inventory_plant ip where quantity > ? AND category = ? AND ip.active = ? AND p.scientific_name = ip.plant_id LIMIT ${skip} , ${ITEMS_PER_PAGE}`,
        [0, category, "t"]
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

exports.getPlants = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  db.execute(
    "SELECT COUNT(*) AS count FROM inventory_plant WHERE active = ? AND quantity > ?",
    ["t", 0]
  )
    .then((result) => {
      totalItems = result[0][0].count;
      let skip = (page - 1) * ITEMS_PER_PAGE;
      return db.execute(
        `SELECT * FROM plant p , inventory_plant ip where quantity > ? AND ip.active = ? AND p.scientific_name = ip.plant_id LIMIT ${skip} , ${ITEMS_PER_PAGE}`,
        [0, "t"]
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

//todo
exports.getTodo = (req, res, next) => {
  Todo.find()
    .then((result) => {
      res.render("todo", {
        todo: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.postTodo = (req, res, next) => {
  const newTodo = new Todo({
    todo: req.body.todo,
  });

  newTodo
    .save()
    .then(() => {
      console.log("Successfully added todo!");
      res.redirect("/todo");
    })
    .catch((err) => console.log(err));
};

exports.deleteTodo = (req, res, next) => {
  const { _id } = req.params;

  Todo.deleteOne({ _id })
    .then(() => {
      console.log("Deleted Todo Successfully!");
      res.redirect("/todo");
    })
    .catch((err) => console.log(err));
};

//blog
exports.getBlog = (req, res, next) => {
  Post.find()
    .then((result) => {
      res.render("blog", {
        posts: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPost = (req, res, next) => {
  const id = req.params.id;

  Post.findById(id)
    .populate("comments")
    .exec()
    .then((result) => {
      // console.log(result);
      res.render("post", {
        post: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddPost = (req, res, next) => {
  res.render("add-post");
};

exports.postAddPost = (req, res, next) => {
  const title = req.body.title;
  const tag = req.body.tag;
  const description = req.body.description;
  const image = req.file;
  imageUrl = image.path;
  // imageUrl = image.path;
  // const desc = req.body.description;

  const newPost = new Post({
    title: title,
    tag: tag,
    image: imageUrl,
    description: description,
  });

  newPost
    .save()
    .then((result) => {
      res.redirect("/blog");
    })
    .catch((err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  Post.findByIdAndDelete(id)
    .then((result) => {
      res.redirect("/blog");
    })
    .catch((err) => console.log(err));
};

exports.postComment = (req, res, next) => {
  const comment = new Comment({
    author: req.user.email,
    comment: req.body.comment,
  });

  comment
    .save()
    .then((myComment) => {
      Post.findById(req.params.id)
        .then((result) => {
          // console.log("result = ");
          // console.log(result.comments);

          result.comments.push(myComment);
          result.save();
          route = req.params.id;
          // console.log(post.comments);
          res.redirect("/posts/" + route);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
  // console.log(req.params);
  const route = req.params.id;
  const redirectTo = req.params.post;

  Comment.findOneAndDelete({ _id: route })
    .then((result) => {
      res.redirect("/posts/" + redirectTo);
    })
    .catch((err) => next(err));
};

exports.getUpdatePost = (req, res, next) => {
  const id = req.params.id;
  //IMPORTANT
  // RENDER THE POST
  Post.findById(id)
    .then((result) => {
      res.render("edit-post", {
        post: result,
      });
    })
    .catch((err) => next(err));
};

exports.updatePost = (req, res, next) => {
  const id = req.body.postId;
  console.log(req.body);
  if (!req.file) {
    Post.findByIdAndUpdate(id, {
      title: req.body.title,
      tag: req.body.tag,
      description: req.body.description,
    })
      .then((result) => {
        res.redirect("/posts/" + id);
      })
      .catch((err) => next(err));
  } else {
    Post.findByIdAndUpdate(id, {
      title: req.body.title,
      tag: req.body.tag,
      description: req.body.description,
      image: req.file.path,
    })
      .then((result) => {
        res.redirect("/posts/" + id);
      })
      .catch((err) => next(err));
  }
};

exports.removePost = (req, res, next) => {
  const id = req.params.id;
  Post.findByIdAndDelete(id)
    .then((result) => {
      res.redirect("/blog");
    })
    .catch((err) => console.log(err));
};
