const db = require("../util/database");

exports.getCart = async (req, res, next) => {
  try {
    await db
      .execute(
        "SELECT * FROM cart_item c JOIN inventory_plant USING(IPID) WHERE c.user_id = ?",
        [req.user.user_id]
      )
      .then((myPlants) => {
        res.render("cart", {
          plants: myPlants[0],
        });
      });
  } catch (err) {
    res.status(500);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCart = (req, res, next) => {
  const plantId = req.body.plantId;
  addToCart(req.user.user_id, plantId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      res.status(500);
      console.log("err");
    });
};

const addToCart = async (userId, plantId) => {
  return db
    .execute("SELECT * FROM cart_item WHERE IPID = ? AND user_id = ?", [
      plantId,
      userId,
    ])
    .then((result) => {
      if (result[0].length == 0) {
        return db.execute("INSERT INTO cart_item VALUES (? , ? , ?)", [
          plantId,
          userId,
          1,
        ]);
      } else {
        // console.log(result[0][0]);
        let q = result[0][0].item_quantity + 1;
        try{
         db.execute(
          `UPDATE cart_item SET item_quantity = ?
       WHERE IPID = ? AND user_id = ?`,
          [q, plantId, userId]
        ).then(result=>{
          return result;
        }) }catch(err){};
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postQuantity = async (req, res, next) => {
  const q = req.body.quantity;
  console.log(q);
  const userId = req.body.cusId;
  const plantId = req.body.IPID;
  // console.log(q, userId, plantId);
  if (q > 0) {
    try{db.execute(
      `UPDATE cart_item SET item_quantity = ?
    WHERE IPID = ? AND user_id = ?`,
      [q, plantId, userId]
    )
      .then((result) => {
        res.redirect("/cart");

      })
    }catch(err){
        res.status(500);
        next(err);
      };
  } else {

    res.redirect("/cart");
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await db
      .execute("delete from wahah.cart_item where IPID = ? AND user_id =?", [
        prodId,
        req.user.user_id,
      ])
      .then(() => {
        res.redirect("/cart");
        res.status(204);
      });
  } catch (err) {
    res.status(500);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getDeleteItem = async (req, res, next) => {
  const IPID = req.params.IPID;
  const cusId = req.params.user_id;
  try {
    await db
      .execute("DELETE FROM cart_item WHERE IPID = ? AND user_id = ?", [
        IPID,
        cusId,
      ])
      .then(() => {
        res.redirect("/cart");
        res.status(204);
      });
  } catch (err) {
    res.status(500);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
