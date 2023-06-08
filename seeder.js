const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
var csv= require('csvtojson');
var salesmodel = require('./models/sales')
var adminmodel = require('./models/admin')
const { MONGODB_URI, DB_NAME } = process.env;


async function main() {
    await mongoose
  .connect(MONGODB_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });
  
    /**
     * Import the CSV data into the database
     */
    try {
      await csv()
      .fromFile(path.join(__dirname, "sales.csv"))
      .then(async (jsonObj) => {
        const done = await salesmodel.insertMany(jsonObj);
        if(done)
          console.log("CSV Data Successfully Inserted in CarSales table");
          });


          const carmake = await salesmodel.aggregate([
      
            {$group: {_id: "$carmake"}},
            {
            $project: {
              carmake: '$_id',
              _id: 0
            }},
            { $merge: {
              into: 'carmakes',
              whenMatched: "replace",  
              whenNotMatched: "insert"                
         }
        }
          ]);
          if (carmake)
          console.log("Car Make Table Created")

          const carmodel= await salesmodel.aggregate([
      
            {$group: {_id: "$carmodel"}},
            {
            $project: {
              carmodel: '$_id',
              _id: 0
            }},
            { $merge: {
              into: 'carmodels',
              whenMatched: "replace",  
              whenNotMatched: "insert"                
         }
        }
          ]);
          if (carmodel)
          console.log("Car Model Table Created")

          const caryear= await salesmodel.aggregate([
      
            {$group: {_id: "$caryear"}},
            {
            $project: {
              caryear: '$_id',
              _id: 0
            }},
            { $merge: {
              into: 'caryears',
              whenMatched: "replace",  
              whenNotMatched: "insert"                
         }
        }
          ]); 


          if (caryear)
          console.log("Car Year Table Created")

          const admin = new adminmodel({email:"admin@gmail.com", password:"admin" });
        await admin.save();
          if (admin)
          console.log("Dummy Admin added")

                
        process.exit();

      } catch (error) {
        console.error("error:", error);
        process.exit();
      }
    }

main();