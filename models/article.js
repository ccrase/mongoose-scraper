var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    link:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true
    },
    //look up reference for note !!!!!
    note:{
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

var Article = mongoose.model('article', articleSchema);

module.exports = Article;