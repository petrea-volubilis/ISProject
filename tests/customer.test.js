const customer=require('../controllers/customer');
const sinon = require('sinon');
const db = require("../util/database");
const genPassword = require("../util/passwordUtil").genPassword;
const { validationResult } = require("express-validator/check");
const { check, body } = require("express-validator/check");


test('add user correctly',async()=>{
const req={
    body:{
        password:'password',
        email:'abdullah@gmail.com'
    },
}
const res={
    redirect:function (d){

    },
    render:function (d,s){

    }
}
await customer.postSignUp(req,res,()=>{});
await db.execute("SELECT * FROM user WHERE email = ?", [req.body.email])
      .then((result) => {
       expect(result[0][0].email).toBe(req.body.email)
        } )

 await deletuser('abdullah@gmail.com');

})

test('should return statusCode 200 the entered email exsist accunt',async()=>{
    const req={
        body:{
            password:'password',
            email:'abdullah@gmail.com'
        },
    }
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
await customer.postLogin(req,res,()=>{});
  expect(res.statusCode).toBe(200)
   await deletuser('abdullah@gmail.com');


    })

test('should return statusCode 422 the entered email is not registered previously',async()=>{
    const req={
        body:{
            password:'password',
            email:'abdullah@gmail.com'
        },
    }
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

  await customer.postLogin(req,res,()=>{});
  expect(res.statusCode).toBe(422)

    })



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

