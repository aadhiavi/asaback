const mongoose = require('mongoose');

const AsaFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true}, 
    message: { type: String, required: true },
}, { timestamps: true });

AsaFormSchema.index({ email: 1, number: 1 });

module.exports = mongoose.model('AsaForm', AsaFormSchema);


