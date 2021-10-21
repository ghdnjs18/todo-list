const mongoose = require('mongoose')

const userSchema = mongoose.Schema({ // 스키마 정의
    name: {type: String, required: true, trim: true},
    age: {type: Number, require: true, trim: true},
    email: {type: String, require: true, trim: true},
    todos: {type: Array,  require: true, trim: true}
});

const User = mongoose.model('Todo', userschaa) // 스키마로부터 생성된 모델 객체
module.exports = User;