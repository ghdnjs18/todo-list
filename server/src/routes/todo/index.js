const express = require('express')
const TodoRouter = express.Router()
const Todo = require("../../models/Todo")


// TodoRouter.route('/').get((req, res) => {
//     res.send('all todo list')
// })

TodoRouter.get('/', async(req, res) => {
    // DB내 모든 데이터 검색 / async, await가 있어야 검색동안 대기하여 오류가 안난다.
    const todos = await Todo.find();
    res.json({status: 200, todos});
});

TodoRouter.get('/:id', (req, res) => {
    // DB내 특정 id를 통해서 검색
    Todo.findById(req.params.id, (err, todo) => {
        if(err) throw err;
        res.json({status:200, todo});
    });
});

TodoRouter.post('/', (req, res) => {
    console.log(`name : ${req.body.name}`);
    Todo.findOne({name: req.body.name, done: false}, async(err, todo) => {
        if(err) throw err;
        if(!todo) {
            const newTodo = new Todo(req.body); // req 정보를 가진 객체를 생성
            // await 뒤에 문법을 실행할때까지 기다려준다. 비동기를 동기형식으로 사용함.
            await newTodo.save().then(() => {
                res.json({status: 201, msg: 'new todo created in db !', newTodo});
            });
        } else { // 생성하려는 할일과 같은 이름이고 아직 끝내지 않은 할일이 이미 DB에 존재하는 경우
            const msg = 'this todo already exists in db !';
            console.log(msg);
            res.json({status: 204, msg});
        }
    });
});

TodoRouter.put('/:id', (req, res) => {
    // id를 찾아서 변경한 내용을 업데이트 한다. 세번째 인자가 true여야 반환을 한다.
    Todo.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, todo) => {
        if(err) throw err;
        res.json({status:204, msg: `todo ${req.params.id} updated`, todo});
    });
});

TodoRouter.delete('/:id', (req, res) => {
    // id를 찾아서 데이터를 삭제한다.
    Todo.findByIdAndRemove(req.params.id, (err, todo) => {
        if(err) throw err;
        res.json({ status:204, msg: `todo ${req.params.id} removed in db !`});
    });
});


module.exports = TodoRouter