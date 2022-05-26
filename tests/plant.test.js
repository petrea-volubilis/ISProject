const plant=require('../controllers/plant');
const sinon = require('sinon');
const db = require("../util/database");


describe('testig add plant function',()=>{
  

test('Add plant correctly',async ()=>{
    const res={
            redirect:function(c){
            } , 
                statusCode: 200,
                status: function(code) {
                  this.statusCode = code; 
           },
          }
    const req={
        body:{
            light:'low',
            sof:'winter',
            fli:'xx',
            pruning:'x',
            lu:'x',
            gh:'xx',
            sn:'dummy',
           soil :'vv',
           category:'fgf',
           spread:'hdfh',
           height:'454',
           desc:'ghjg'
        }
    }
    

    await  plant.postAddPlant(req,res,()=>{});

    await db.execute(
        "SELECT * FROM wahah.plant   where scientific_name ='dummy';"
      )
        .then((result) => {
         expect(result[0][0].scientific_name).toBe('dummy');
        })
        .catch((err) => {
          console.log(err);
        });
       await deletPlant('dummy');

});


test('If the plant is not added correctly, change status code to 500',async()=>{
    const res={
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
        },
        redirect:function(c){
                   } ,    
                }
    const req={  
        body:{
            light:'low',
            sof:'winter',
            fli:'xx',
            pruning:'x',
            lu:'x',
            gh:'xx',
            sn:null,
           soil :'vv',
           category:'fgf',
           spread:'hdfh',
           height:'454',
           desc:'ghjg'
        }
    }
 await plant.postAddPlant(req,res,()=>{});
expect(res).toHaveProperty("statusCode",500);

});

})


describe('testing inventory function',()=>{
    
test('get inventory correctly',async()=>{
    const res={
        plant:[],
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
        render:function(x,plant){
            this.plant=plant;
        }
    }
    //add dummy plant to the database
 await addPlant('dummy');
 await plant.getAddInventory({},res,()=>{});
       expect(res.plant.plants).toContain('dummy');
 await deletPlant('dummy');

})

test('should throw an error with code 500 if accessing the database fails getAddInventory  ',async()=>{
    const res={
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
    }
          sinon.stub(db,'execute');
          db.execute.throws();
          plant.getAddInventory({},res,()=>{});
          expect(res).toHaveProperty("statusCode",500);
    
          db.execute.restore();
})

test('post add inventory correctly',async()=>{
    const res={
        plant:[],
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
        render:function(x,plant){
            this.plant=plant;
        },
        redirect:function(d){

        }
    }
   
    const req={
        body:{
p:'dummy',
name:'fgd',
size:'45',
color:'asd',
quantity:'35',
price:'55',
        }
        ,
 file:{path:'sdfsdf.jpg'}
    }
    //add dummy plant to the database
 await addPlant('dummy');
 await plant.postAddInventory(req,res,()=>{});
 await db.execute(
            "SELECT * FROM wahah.inventory_plant   where plant_id =?;",['dummy']
          )
            .then((result) => {
                expect(result[0][0].quantity).toBe(35);
            })
            .catch((err) => {
              console.log(err);
            }); 
            await deletPlant('dummy');

})

test('post add inventory should throw an error with code 500 if accessing the database fails',async()=>{
    const res={
        plant:[],
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
        render:function(x,plant){
            this.plant=plant;
        },
        redirect:function(d){

        }
    }
   
    const req={
        body:{
p:'dummy',
name:'fgd',
size:'45',
color:'asd',
quantity:'35',
price:'55',
        }
        ,
 file:{path:'sdfsdf.jpg'}
    }

            sinon.stub(db,'execute');
                      db.execute.throws();
                      await plant.postAddInventory(req,res,()=>{});
                      expect(res).toHaveProperty("statusCode",500);
                
                      db.execute.restore();
})


test('post edit inventory correctly',async()=>{
    const res={
        plant:[],
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
        redirect:function(d){
        }
    }
   
  await addPlant('dummy');
  await addinventory('dummy');
  let IPID=0;
// to git IPID for dummy
  await db.execute(
        "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
      )
        .then((result) => {
        IPID=result[0][0].IPID;
   
        })
        .catch((err) => {
          console.log(err);
        });
    const req={
        body:{
p:'dummy',
name:'fgd',
size:'45',
color:'asd',
quantity:'20',
price:'55',
IPID:IPID
        }
        ,
 file:{path:'sdfsdf.jpg'}
    }
    
 await plant.postEditInventory(req,res,()=>{});
 await db.execute(
            "SELECT * FROM wahah.inventory_plant   where plant_id =?;",['dummy']
          )
            .then((result) => {
                expect(result[0][0].quantity).toBe(20);
            })
            .catch((err) => {
              console.log(err);
            }); 
            await deletPlant('dummy');

})

test('post edite inventory should throw an error with code 500 if accessing the database fails',async()=>{
    const res={
        plant:[],
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
        render:function(x,plant){
            this.plant=plant;
        },
        redirect:function(d){

        }
    }
   
    const req={
        body:{
p:'dummy',
name:'fgd',
size:'45',
color:'asd',
quantity:'35',
price:'55',
IPID:'55'
        }
        ,
 file:{path:'sdfsdf.jpg'}
    }

            sinon.stub(db,'execute');
                      db.execute.throws();
                      await plant.postEditInventory(req,res,()=>{});
                      expect(res).toHaveProperty("statusCode",500);
                
                      db.execute.restore();
})


})

test('should return the details of the planet ',async()=>{

  await addPlant('dummy');
  await addinventory('dummy');
  let IPID=0;
// to get IPID for dummy
  await db.execute(
        "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
      )
        .then((result) => {
        IPID=result[0][0].IPID;
   
        })
        .catch((err) => {
          console.log(err);
        });

        const res={
            statusCode: 200,
            status: function(code) {
              this.statusCode = code;
              
            }, 
            plants:null,
            render:function(x,plant){
                this.plants=plant;
            }
        }
    const req={
        params:{
            plantId:IPID
        }
    }
    
    
    await plant.details(req,res,()=>{});
          expect(res.plants.plant.IPID).toBe(IPID);
          await deletPlant('dummy');
   
        
})



test('should throw an error with code 500 if accessing the database fails ',async()=>{

   
    let IPID='0';
  // to git IPID for dummy
    await db.execute(
          "SELECT * FROM wahah.inventory_plant WHERE plant_id=?;",['dummy']
        )
          .then((result) => {
          IPID=result[0][0].IPID;
     
          })
          .catch((err) => {
            console.log(err);
          });
  
          const res={
              statusCode: 200,
              status: function(code) {
                this.statusCode = code;
                
              }, 
              plants:null,
              render:function(x,plant){
                  this.plants=plant;
              }
          }
      const req={
          params:{
              plantId:IPID
          }
      }
      
      
      sinon.stub(db,'execute');
      db.execute.throws();
      await plant.details(req,res,()=>{});
      expect(res).toHaveProperty("statusCode",500);
    
      db.execute.restore();            
     
          
  })




describe('test mange plant function',()=>{


  test('get ManagePlant correctly',async()=>{
    const res={
        plants:[],
        statusCode: 200,
        status: function(code) {
          return this.statusCode = code;
          
        },
        render:function(x,plant){
            this.plants=plant;
        }
    }
    // add dummy plant to the database
 await addPlant('dummy');
 await plant.getManagePlant({},res,()=>{});
       expect(res.plants.plants).toContain('dummy');
 await deletPlant('dummy');

})

test('should throw an error with code 500 if accessing the database fails ',async()=>{
    const res={
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
    }
          sinon.stub(db,'execute');
          db.execute.throws();
          await plant.getManagePlant({},res,()=>{});
          expect(res).toHaveProperty("statusCode",500);
    
          db.execute.restore();
})

})


describe('test post edite plant funcion',()=>{

    test('Edite plant correctly',async ()=>{
        const res={
                redirect:function(c){
                } , 
                    statusCode: 200,
                    status: function(code) {
                      this.statusCode = code; 
               },
              }
        const req={
            body:{
                light:'high',
                sof:'summer',
                fli:'xx',
                pruning:'y',
                lu:'x',
                gh:'xx',
                sn:'dummy',
               soil :'vv',
               category:'fgf',
               spread:'hdfh',
               height:'454',
               desc:'ghjg'
            }
        }
        await addPlant('dummy')
    // edit 
        await  plant.postEditPlant(req,res,()=>{});
        await db.execute(
            "SELECT * FROM wahah.plant   where scientific_name =?;",['dummy']
          )
            .then((result) => {
                expect(result[0][0].season_of_interest).toBe('summer');
                expect(result[0][0].light).toBe('high');
            })
            .catch((err) => {
              console.log(err);
            });
            
           await deletPlant('dummy');
    
    });
    
    test('should throw an error with code 500 if accessing the database fails ',async()=>{
    const res={
        statusCode: 200,
        status: function(code) {
          this.statusCode = code;
          
        },
    }
    const req={
        body:{
            light:'high',
            sof:'summer',
            fli:'xx',
            pruning:'y',
            lu:'x',
            gh:'xx',
            sn:'dummy',
           soil :'vv',
           category:'fgf',
           spread:'hdfh',
           height:'454',
           desc:'ghjg'
        }
    }
    await addPlant('dummy')
          sinon.stub(db,'execute');
          db.execute.throws();
          await plant.postEditPlant(req,res,()=>{});
          expect(res).toHaveProperty("statusCode",500);    
          db.execute.restore();
          await deletPlant('dummy')

})



})



// helping function
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
async function addinventory(name,ipid) {
    await db.execute(
        "INSERT INTO inventory_plant(plant_id, name, size, color, quantity, price, image,active) VALUES(?,?,?,?,?,?,?,?)",
        [name,'sd', 5, 5, 4,54,'gpj','t']
      )
        .then(() => {
        })
        .catch((err) => {
            console.log(err);
          const error = new Error(err);
          error.httpStatusCode = 500;
         
        });
       
    
}
async function deletinventory(id) {
    await db.execute(
        "delete  FROM inventory_plan WHERE IPID=?;",[id]
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

afterAll(async() => {
    
        //close conection 
       db.end();
  })



