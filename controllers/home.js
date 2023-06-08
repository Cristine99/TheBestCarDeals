const salesmodel = require('../models/sales');


// Create Home Screen and List all Records

exports.list = async (req, res) => {
    try {

    
        const totalrecords = await salesmodel.find({}).count();
        const totalcarmakes = await salesmodel.aggregate([
            { $group: { _id: "$carmake", sum: { $sum: 1 } } },
            { $count: "sum" }
        ]);
        const salesCountSummaryRef = await salesmodel.aggregate(
            [
                {
                    $group: {
                        _id: "$carmake",
                        total: { $sum: 1 }
                    }
                }]);
        const salesCountSummary = salesCountSummaryRef.map(t => ({ name: t._id, total: t.total }));

        res.render("pages/home", { salesCountSummary: salesCountSummary, totalrecords: totalrecords,
            totalcarmakes: totalcarmakes[0].sum, totalcarmakerecords: salesCountSummary.length });

    } catch (e) {
        console.log(e);
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}