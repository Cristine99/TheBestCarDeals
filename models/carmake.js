const mongoose = require("mongoose");
const { Schema } = mongoose;

const carmakeSchema = new Schema(
    {
        carmake: { type: String, required: [true, 'Car Make is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("carmakes", carmakeSchema);