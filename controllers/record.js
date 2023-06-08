const sales = require("../models/sales")


// Show all Records but split them in Pages
exports.list = async (req, res) => {
    const perPage = 10;
    const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
    const page = parseInt(req.query.page) || 1;
  
  
    try {
      const records = await sales.find({}).skip((perPage * page) - perPage).limit(limit);
      const count = await sales.find({}).count();
      const numberOfPages = Math.ceil(count / perPage);
  
      res.render("pages/record", {
        records: records,
        numberOfPages: numberOfPages,
        currentPage: page
      });
    } catch (e) {
      res.status(404).send({ message: "could not list records" });
    }
  };

  // List all records of a specific car make

  exports.listbycarmake= async(req,res)=>{
    const perPage = 10;
    const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
    const page = parseInt(req.query.page) || 1;
  
  
    try {
      const records = await sales.find({carmake : req.params.carmake}).skip((perPage * page) - perPage).limit(limit);
      const count = await sales.find({}).count();
      const numberOfPages = Math.ceil(count / perPage);
  
      res.render("pages/record", {
        records: records,
        numberOfPages: numberOfPages,
        currentPage: page
      });
    } catch (e) {
      res.status(404).send({ message: "could not list records" });
    }
  };

  // Add a record

  exports.create = async (req, res) => {

    try {
      const record = new sales({ 
        salesperson : req.body.salesperson ,
        customername : req.body.customername ,
        carmake : req.body.carmake ,
        carmodel : req.body.carmodel ,
        caryear : req.body.caryear ,
        saleprice : req.body.saleprice ,
        comissionrate : req.body.comissionrate ,
        comissionearned : req.body.comissionearned
      });
      await record.save();
      res.redirect('/viewrecords/?message=Record has been added')
    } catch (e) {
      return res.status(400).send({
        message: JSON.parse(e),
      });
    }
  }


  // Edit a record

  exports.edit = async (req, res) => {
    const id = req.params.id;
    try {
      const record = await sales.findById(id);
      res.render('pages/update-record', { record: record, id: id });
    } catch (e) {
      res.status(404).send({
        message: `could edit record ${id}.`,
      });
    }
  };


  // Update a record

  exports.update = async (req, res) => {
    const id = req.params.id;
    try {
      const record = await sales.updateOne({ _id: id }, req.body);
      res.redirect('/viewrecords/?message=record has been updated');
    } catch (e) {
      res.status(404).send({
        message: `could edit record ${id}.`,
      });
    }
  };

  // Delete a record

  exports.delete = async (req, res) => {
    try {
      await sales.findByIdAndRemove(req.params.id);
      res.redirect("/viewrecords");
    } catch (e) {
      res.status(404).send({
        message: `could not delete record ${id}.`,
      });
    }
  };