const mongoose = require("mongoose");
const { Schema } = mongoose;

const caryearSchema = new Schema(
    {
        caryear: { type: Number, required: [true, 'Car Year is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("caryears", caryearSchema);