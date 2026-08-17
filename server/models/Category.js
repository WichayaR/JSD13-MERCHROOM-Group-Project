const mongoose = require('mongoose'); 

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
    description: String,
    
    slug: { type: String, required: true, unique: true } 
}, { 
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
}); 

module.exports = mongoose.model('Category', CategorySchema);
