const cart=require('../controllers/cart');
const customer=require('../controllers/customer');
const plant=require('../controllers/plant')
const db = require("../util/database");
const sinon = require('sinon');



describe('test getcart function',()=>{

test('should return plant in the cart  after call getcart',async()=>{
    //create dummy user,plant...
    await addPlantToCart();
    //get id for the dummy user
   let user_id=0;
    await db.execute('SELECT user_id FROM  wahah.user where email=?',['abdullah@gmail.com'])
.then(result=>{
  user_id= result[0][0].user_id
});
    const req={
        user:{user_id}
    }
    const res={
        plants:null,
        render:function(x,myPlant){
            plants=myPlant;
        },
        statusCode: 200,
        status: function(code) {
          return this.statusCode = code;
          
        },
    }
    
     await cart.getCart(req,res,()=>{})
expect(plants).toBeDefined();
expect(plants.plants[0].plant_id).toContain('dummy');
await deletuser('abdullah@gmail.com');
await deletPlant('dummy');

})
test('should return statusCode 500 if there any error',async()=>{

    const req={
        user:0
    }
    const res={
        plants:null,
        render:function(x,myPlant){
            plants=myPlant;
        },
        statusCode: 200,
        status: function(code) {
          return this.statusCode = code;
          
        },
    }
    
     sinon.stub(db,'execute');
     db.execute.throws();
     await cart.getCart(req,res,()=>{})
     expect(res).toHaveProperty("statusCode",500);
   
     db.execute.restore();            

})
})

describe('post quantit function',()=>{

test('should redirect the page to /cart and add new Quantity ',async()=>{
 //create dummy user,plant...
 await addPlantToCart()

   //get id for the dummy user
let user_id=0;
await  db.execute('SELECT * FROM  wahah.user where email=?',['abdullah@gmail.com'])
.then(result=>{
    user_id= result[0][0].user_id;


});
let plantId =0;
await db.execute(
    "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
  )
    .then((result) => {
        plantId= result[0][0].IPID;

    })
    const req={
        body:{
            cusId: user_id,
            IPID: plantId ,
            quantity: 1 
        }
    }
     
    
    const res={
        statusCode: 200,
        status:  function(code) {
          return this.statusCode = code;
          
        },
        http:null,
        redirect: function(c){
            return http=c;
         } ,
        
    }
   
     await cart.postQuantity(req,res,()=>{});

     let qunt=0;
     await  db.execute('SELECT * FROM  wahah.cart_item where user_id=? and IPID=?;',[req.body.cusId,req.body.IPID])
    .then(result=>{
     qunt= result[0][0].item_quantity;
     ;});
    expect(http).toBe("/cart");
    expect(qunt).toBe(1);

    await deletuser('abdullah@gmail.com');
    await deletPlant('dummy');


})


test('should change statusCode 500 if there any error',async()=>{

    const req={
        body:{
            cusId: 0,
            IPID: 0 ,
            quantity: 1 
        }
    }
    const res={
        plants:null,
        render:function(x,myPlant){
            plants=myPlant;
        },
        statusCode: 200,
        status: function(code) {
          return this.statusCode = code;
          
        },
    }
    
     sinon.stub(db,'execute');
     db.execute.throws();
     await cart.postQuantity(req,res,()=>{});
     expect(res).toHaveProperty("statusCode",500);
   
     db.execute.restore();            

})

})



describe('post postCartDeleteProduct function',()=>{

test('should Delete Product and redirect the page to /cart then change statusCode 500',async()=>{
 //create dummy user,plant...
 await addPlantToCart()

   //get id for the dummy user
let user_id=0;
await  db.execute('SELECT * FROM  wahah.user where email=?',['abdullah@gmail.com'])
.then(result=>{
    user_id= result[0][0].user_id;


});
let plantId =0;
await db.execute(
    "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
  )
    .then((result) => {
        plantId= result[0][0].IPID;

    })
    const req={
        body:{
            productId: plantId,
        },
        user:{
            user_id: user_id ,
        }
    }
     
    
    const res={
        statusCode: 200,
        status:  function(code) {
          return this.statusCode = code;
          
        },
        http:null,
        redirect: function(c){
            return http=c;
         } ,
        
    }
   
     await cart.postCartDeleteProduct(req,res,()=>{});

    
    expect(http).toBe("/cart");
     expect(res).toHaveProperty("statusCode",204);

    await deletuser('abdullah@gmail.com');
    await deletPlant('dummy');


})


test('should return statusCode 500 if there any error',async()=>{

    const req={
        body:{
            productId: 0,
        },
        user:{
            user_id: 0 ,
        }
    }
    const res={
        plants:null,
        render:function(x,myPlant){
            plants=myPlant;
        },
        statusCode: 200,
        status: function(code) {
          return this.statusCode = code;
          
        },
    }
    
     sinon.stub(db,'execute');
     db.execute.throws();
     await cart.postCartDeleteProduct(req,res,()=>{});
     expect(res).toHaveProperty("statusCode",500);
   
     db.execute.restore();            

})

})


describe('post getDeleteItem function',()=>{

    test('should Delete Product and redirect the page to /cart then change statusCode 500',async()=>{
     //create dummy user,plant...
     await addPlantToCart()
    
       //get id for the dummy user
    let user_id=0;
    await  db.execute('SELECT * FROM  wahah.user where email=?',['abdullah@gmail.com'])
    .then(result=>{
        user_id= result[0][0].user_id;
    
    
    });
    let plantId =0;
    await db.execute(
        "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
      )
        .then((result) => {
            plantId= result[0][0].IPID;
    
        })
        const req={
            params:{
                IPID:plantId,
            user_id:user_id
        }
    }
        
        const res={
            statusCode: 200,
            status:  function(code) {
              return this.statusCode = code;
              
            },
            http:null,
            redirect: function(c){
                return http=c;
             } ,
            
        }
       
         await cart.getDeleteItem(req,res,()=>{});
    
        
        expect(http).toBe("/cart");
         expect(res).toHaveProperty("statusCode",204);
    
        await deletuser('abdullah@gmail.com');
        await deletPlant('dummy');
    
    
    })
    
    
    test('should return statusCode 500 if there any error',async()=>{
    
        const req={
            params:{
                IPID:0,
            user_id:0
        }
        }
        const res={
            plants:null,
            render:function(x,myPlant){
                plants=myPlant;
            },
            statusCode: 200,
            status: function(code) {
              return this.statusCode = code;
              
            },
        }
        
         sinon.stub(db,'execute');
         db.execute.throws();
         await cart.getDeleteItem(req,res,()=>{});
         expect(res).toHaveProperty("statusCode",500);
       
         db.execute.restore();            
    
    })
    
    })
    





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

//helping function


//In this function we create a customer then we add a plant then we  extrace the ID of the plant and user 
// then we add a stock to the inventory plant 
// after that we add the plant in the shopping cart 
async function addPlantToCart(name) {
   await addCustomer();
  await  addPlant('dummy');
  await addinventory('dummy');
// return id of the customer
const customerId=await db.execute('SELECT * FROM  wahah.user where email=?',['abdullah@gmail.com'])
.then(result=>{
 return result[0][0].user_id
});
//return return id of the plant
const plantId =await db.execute(
    "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
  )
    .then((result) => {
    return result[0][0].IPID;

    })
   addToCart(customerId,plantId)

    
}
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
        })
        .catch((err) => {
            console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
         
        });
       
    
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
      .catch((err) => {
        // next(err);
      });
  };

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
   
afterAll(async() => {
    
    //close conection 
   db.end();
})

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

