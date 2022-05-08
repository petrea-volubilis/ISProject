const plant=require('../controllers/plant');
const db = require("../util/database");

// test('Add plant correctly',()=>{
//     const req={
//         body:{
//             light:'',
//             sof:'',
//             fli:'',
//             pruning:'',
//             lu:'',
//             gh:'',
//             sn:'',
//            soil :'',
//            category:'',
//            spread:'',
//            height:'',
//            desc:''

//         }
//     }
// plant.postAddPlant(req,{},{});
//     db.execute(
//         "SELECT * FROM plant p , inventory_plant ip where p.scientific_name = ip.plant_id"
//       )
//         .then((result) => {
//          expect(result[0]).toBeDefined();
//         })
//         .catch((err) => {
//           const error = new Error(err);
//           error.httpStatusCode = 500;
//           return next(error);
//         });
// });



// test('If the plant is not added correctly, send an error',(done)=>{
//     const req={
//         body:{
//             light:'',
//             sof:'',
//             fli:'',
//             pruning:'',
//             lu:'',
//             gh:'',
//             sn:'',
//            soil :'',
//            category:'',
//            spread:'',
//            height:'',
//            desc:''

//         }
//     }
// const x=plant.postAddPlant(req,{},()=>{});
// done();

// expect(x).toHaveProperty("httpStatusCode",500);

// })



// test("get plant corrctly",()=>{
//     const res={
//         Arr:null
//         ,
//         render:function(x ,plantsArr){
//          Arr=plantsArr
//         }
//     }
//     plant.getPlants({},res,{});
// expect(res.Arr).not.toBeNull();

// })