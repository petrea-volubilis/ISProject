const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");

const db = require("../util/database");

exports.getOrders = (req, res, next) => {
  if(req.user.role=='mm'){
    let num = 0;
  db.execute("SELECT * FROM wahah.order ")
    .then((result) => {
      let orders = result[0];
      let myOrders = orders;
      if (orders.length === 0) {
        res.render("order-manager", {
          orders: myOrders,
        });
      } else {
        function populate() {
          for (let i = 0; i < orders.length; i++) {
            console.log(myOrders[i].order_no);
            db.execute(
              "SELECT * FROM order_item JOIN inventory_plant USING(IPID) WHERE order_no = ?",
              [myOrders[i].order_no]
            )
              .then((prods) => {
                myOrders[i].products = prods[0];

                num = num + 1;
                if (num == myOrders.length) {
                  res.render("order-manager", {
                    orders: myOrders,
                  });
                }
              })
              .catch((err) => {
                next(err);
              });
          }
        }
        return populate();
      }
    })
    .then((orders) => {
      console.log("ok");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });


  }else{
  let num = 0;
  db.execute("SELECT * FROM wahah.order WHERE user_id = ?", [req.user.user_id])
    .then((result) => {
      let orders = result[0];
      let myOrders = orders;
      if (orders.length === 0) {
        res.render("order", {
          orders: myOrders,
        });
      } else {
        function populate() {
          for (let i = 0; i < orders.length; i++) {
            console.log(myOrders[i].order_no);
            db.execute(
              "SELECT * FROM order_item JOIN inventory_plant USING(IPID) WHERE order_no = ?",
              [myOrders[i].order_no]
            )
              .then((prods) => {
                myOrders[i].products = prods[0];

                num = num + 1;
                if (num == myOrders.length) {
                  res.render("order", {
                    orders: myOrders,
                  });
                }
              })
              .catch((err) => {
                next(err);
              });
          }
        }
        return populate();
      }
    })
    .then((orders) => {
      console.log("ok");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }
};

exports.postOrder =async (req, res, next) => {
  //check quantity and check if empty
  try{
  await db.execute("SELECT * FROM cart_item WHERE user_id = ?", [req.user.user_id])
    .then((result) => {
  
      if (result[0].length == 0) {
        return "yes";
      } else {
        return  db
          .execute("INSERT INTO wahah.order(user_id) VALUES(?)", [
            req.user.user_id,
          ])
          .then((result) => {
            let no = result[0].insertId;
            return  db.execute(
              `INSERT INTO order_item
              SELECT ${no} AS order_no , IPID , item_quantity as oi_quantity
              FROM cart_item c JOIN inventory_plant p USING(IPID)
              WHERE c.user_id = ?`,
              [req.user.user_id]
            );
          })
          .then((result) => {
            return db.execute(
              `UPDATE inventory_plant ip INNER JOIN cart_item ci ON ci.IPID = ip.IPID 
              SET ip.quantity = ip.quantity - ci.item_quantity
              WHERE ip.IPID IN (SELECT IPID FROM cart_item WHERE user_id = ?)`,
              [req.user.user_id]
            );
          })
          .then((result) => {
            return db.execute("DELETE FROM cart_item WHERE user_id = ?", [
              req.user.user_id,
            ]);
          })
          .then((result) => {
            return db.execute(
              "DELETE FROM cart_item WHERE IPID IN (SELECT IPID FROM inventory_plant WHERE quantity < 1)"
            );
          });
      }
    })
    .then((result) => {
      if (result == "yes") {
        res.redirect("/cart");
      } else {
        console.log('dddggggggggg');
        res.redirect("/order");
        res.status(201);
      }
    })
  }catch(err)  {
    console.log(err);
      res.status(500);
      next(err);
    };
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderNo;
  db.execute("SELECT * FROM wahah.order WHERE order_no = ?", [orderId])
    .then((order) => {
      if (order[0].length === 0) {
        return next(new Error("No order found."));
      }
      // if (order[0][0].user_id !== req.user.user_id) {
      //   return next(new Error("Unauthorized"));
      // }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice");
      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      db.execute(
        `SELECT * 
        FROM order_item JOIN inventory_plant USING(IPID) WHERE order_no = ?`,
        [orderId]
      ).then((prods) => {
        prods[0].forEach((prod) => {
          totalPrice += prod.oi_quantity * prod.price;
          pdfDoc
            .fontSize(14)
            .text(
              prod.name + " - " + prod.oi_quantity + " x " + "$" + prod.price
            );
        });
        pdfDoc.fontSize(26).text("-----------------------");
        pdfDoc.fontSize(20).text("Total Price: $" + totalPrice.toFixed(2));
        pdfDoc
          .fontSize(20)
          .text("Total Price After Taxes: $" + (totalPrice * 1.15).toFixed(2));

        pdfDoc.end();
      });
    })
    .catch((err) => {
      next(err);
    });
};
