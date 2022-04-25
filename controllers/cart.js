const db = require("../util/database");

exports.getCart = (req, res, next) => {
  db.execute(
    "SELECT * FROM cart_item c JOIN inventory_plant USING(IPID) WHERE c.customer_id = ?",
    [req.user.customer_id]
  )
    .then((myPlants) => {
      console.log(myPlants[0]);
      res.render("cart", {
        plants: myPlants[0],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const plantId = req.body.plantId;
  addToCart(req.user.customer_id, plantId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("err");
    });
};

const addToCart = (customerId, plantId) => {
  console.log("im here", customerId, plantId);
  return db
    .execute("SELECT * FROM cart_item WHERE IPID = ? AND customer_id = ?", [
      plantId,
      customerId,
    ])
    .then((result) => {
      if (result[0].length == 0) {
        return db.execute("INSERT INTO cart_item VALUES (? , ? , ?)", [
          plantId,
          customerId,
          1,
        ]);
      } else {
        // console.log(result[0][0]);
        let q = result[0][0].item_quantity + 1;
        return db.execute(
          `UPDATE cart_item SET item_quantity = ?
       WHERE IPID = ? AND customer_id = ?`,
          [q, plantId, customerId]
        );
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postQuantity = (req, res, next) => {
  const q = req.body.quantity;
  const customerId = req.body.cusId;
  const plantId = req.body.IPID;
  // console.log(q, customerId, plantId);
  db.execute(
    `UPDATE cart_item SET item_quantity = ?
    WHERE IPID = ? AND customer_id = ?`,
    [q, plantId, customerId]
  )
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  db.execute("DELETE FROM cart_items WHERE product_id = ? AND user_id = ?", [
    prodId,
    req.user.user_id,
  ])
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDeleteItem = (req, res, next) => {
  const IPID = req.params.IPID;
  const cusId = req.params.customer_id;
  console.log(IPID, cusId);
  db.execute("DELETE FROM cart_item WHERE IPID = ? AND customer_id = ?", [
    IPID,
    cusId,
  ])
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
