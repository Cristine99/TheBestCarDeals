const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const saleschema=new Schema({
  salesperson:{type: String},
  customername:{type: String},
  carmake:{type: String},
  carmodel:{type: String},
  caryear:{type: Number},
  saleprice:{type: Number},
  comissionrate:{type: Number, float: true},
  comissionearned:{type: Number, float: true}
}, 
{timestamps: true});

module.exports= mongoose.model("sales",saleschema);
