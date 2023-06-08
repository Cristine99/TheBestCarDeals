const mongoose = require("mongoose");
const { Schema } = mongoose;

const carmodelSchema = new Schema(
    {
        carmodel: { type: String, required: [true, 'Car Model is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("carmodels", carmodelSchema);