const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
})

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = Gallery;