const mongoose = require('mongoose');
const {Schema} = mongoose;
 
const BlogSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        require: true
    },
    description:{
        type:String,
        require:true,
    },
    date: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('Blogs',BlogSchema)