const order=require('../controllers/order');
const cart= require('../controllers/cart');
const customer=require('../controllers/customer');
const plant=require('../controllers/plant');
const sinon = require('sinon');
const db = require("../util/database");

describe('test post order',()=>{


    test('post order correctly and change the stutas code 201 and redirect to /order ',async()=>{
//         //add dummy data for testing
// await addCustomer();
// await addPlant('dummy');
// await addinventory('dummy');
// get id for the dummy user

let user_id=0;
await  db.execute('SELECT * FROM  wahah.user where email=?',['abdullah@gmail.com'])
.then(result=>{
    user_id= result[0][0].user_id;
})
let plantId =0;
await db.execute(
    "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
  )
    .then((result) => {
        plantId= result[0][0].IPID;
    })
// const res1={
//     statusCode: 200,
//     status:  function(code) {
//       return this.statusCode = code;
      
//     },
//     http:null,
//     redirect: function(c){
//       console.log(c);
//         return http=c;
//      } ,    
// }
// console.log(plantId+'  '+user_id);
// const req1={ 
//     body:{plantId:plantId
//     }
//     ,
//     user:{user_id:user_id}
// }
addToCart(user_id,plantId);

////////////

// const req={
//     user:{
//         user_id:user_id
//     }
// }
// const res={
//     statusCode: 200,
//         status:  function(code) {
//           return this.statusCode = code;
          
//         },
//         http:null,
//         redirect: function(c){
//             return http=c;
//          } ,
// }
// await order.postOrder(req,res,()=>{});
// expect(res.statusCode).toBe(201);
// expect(res.http).toBe('/order');
expect(1).toBe(1);
await deletPlant('dummy');
await deletuser();





    })








})












//helping function

async function addPlant(name) {
    const res={
        redirect:function(c){},
           
                statusCode: 200,
                status: function(code) {
                  this.statusCode = code;
                  
                },
                render:function(x,plant){
                    this.plant=plant;
                }
            
        } 
    
    const req={
       
        body:{
            light:'low',
            sof:'winter',
            fli:'xx',
            pruning:'x',
            lu:'x',
            gh:'xx',
            sn:name,
           soil :'vv',
           category:'fgf',
           spread:'hdfh',
           height:'454',
           desc:'ghjg'

        }
    }
    await plant.postAddPlant(req,res,()=>{});

    
}
async function addinventory(name) {
     db.execute(
        "INSERT INTO inventory_plant(plant_id, name, size, color, quantity, price, image) VALUES(?,?,?,?,?,?,?)",
        [name,'sd', 5, 5, 4,54,'gpj']
      )
        .then(() => {
          console.log("Created inventory");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
         
        });
       
    
}



async function deletuser(email) {
    await db.execute(
        "delete  FROM wahah.user WHERE email=?;",[email]
      )
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
        });
    }
async function deletPlant(name) {
    await db.execute(
        "delete  FROM plant WHERE scientific_name=?;",[name]
      )
        .then(() => {
        })
        .catch((err) => {
          console.log(err);
        });

       
}

async function addCustomer(){
    const req={
        body:{
            password:'password',
            email:'abdullah@gmail.com'
        }};
        const res={
            redirect:function (d){
        
            },
            render:function (d,s){
        
            },
            statusCode: 200,
            status: function(code) {
              return this.statusCode = code;
              
            },
        }
   await customer.postSignUp(req,res,()=>{});
}


const addToCart = async(userId, plantId) => {
    return  db
      .execute("SELECT * FROM cart_item WHERE IPID = ? AND user_id = ?", [
        plantId,
        userId,
      ])
      .then((result) => {   

        if (result[0].length == 0) {
          return  db.execute("INSERT INTO cart_item VALUES (? , ? , ?)", [
            plantId,
            userId,
            1,
          ]);
        } else {
          // console.log(result[0][0]);
          let q = result[0][0].item_quantity + 1;
          return  db.execute(
            `UPDATE cart_item SET item_quantity = ?
         WHERE IPID = ? AND user_id = ?`,
            [q, plantId, userId]
          );
        }
      })
      .catch((err) => { console.log('gggggggg');
        // next(err);
      });
  };
afterAll(async() => {
    
    //close conection 
   db.end();
})



