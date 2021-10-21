var express = require('express') 
var app = express()
var cors = require('cors')
var logger = require('morgan')
var mongoose = require('mongoose')
var routes = require('./src/routes')



// app.set('case sensitive raoutin;')

var corsOptions = { 
    origin: 'http://localhost:3000',
    credentials: true
}

const CONNECT_URL = 'mongodb://localhost:27017/todo_project'
mongoose.connect(CONNECT_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected ..."))
  .catch(e => console.log('failed to connect mongodb: ${e}'))


// 미들웨어 추가
// 파일을 클라이언트에게 응답시키기 위해서 사용
// url을 설정하고 사용할 폴더를 지정 이후에 밑에서 redirect로 파일응답
app.use('/static', express.static(__dirname + '/public'))
app.use(cors(corsOptions))
app.use(express.json())
app.use(logger('tiny'))

app.use('/api', routes)

// 기본 라우팅 및 API 테스트
// get방식 url에 요청을 보내면 db에서 사용자 전체 목록을 조회하고 그 결과를 응답
app.get("/users", (req, res) => {
    // 데이터베이스에서 사용자 전체목록 조회
    res.send("all user list !")
})

// postman 쓰면 좋다 API테스트용 - 번거롭기 때문에 크롬API Tester를 사용하겠다.
// post방식 url에 요청을 보내면 request body를 이용하여 db에 새로운 사용자 생성
app.post('/users', (req, res) => {
    console.log(req.body.newUser)
    // `` 빽픽? 을 사용하면 문자가 그대로 적용 - 자바스크립트 신기능
    res.json(`new user - ${req.body.newUser.name} created !`) 
})

// put방식 url에 요청을 보내면 db에서 id에 해당하는 사용자를 조회한 후
// request body를 이용하여 사용자 정보를 변경한다. / 요청 본문은 페이로드라고도 한다.
// put은 update 대신에 사용한다. / :(콜론)id를 쓰면 users의 id값을 읽어온다.
app.put("/users/:id", (req, res) => {
    console.log(req.body.updateUserInfo)
    // 데이터베이스에서 id에 해당하는 사용자 정보 조회 후 업데이트 (차후 내용 기입)
    res.send(
        `user ${req.params.id} updated with payload ${req.body.updateUserInfo.name}!`
    )
})

// delete방식 id에 해당하는 사용자를 조회한 후 삭제
app.delete("/users/:id", (req, res) => {
    // 데이터베이스에서 id 에 해당하는 사용자 조회 후 제거
    res.send(`user ${req.params.id} removed !`)
})

// wildcard 활용한 대소문자 구분
// app.get("/users*", (req, res) => {
//     res.send("users wildcards !")
// })
// app.get("/users/contact", (req, res) => { 
//     res.send("contact page !") 
// }) 
// app.get("/users/city", (req, res) => {
//      res.send("city page !") 
// })

// 정규식을 이용한 url
// app.get("/go+gle", (req, res) => { // +의 앞에 문자는 얼마든지
//     res.send("google site") // go와 gle사이에 o가 얼마나 있든 가능하다.
// })
app.get("/sylee((mo)+)?", (req, res) => { // ()안에 있는것도 얼마든지 ?가 있으면 앞에 옵션이 있어도 된고 없어도 되고 
    res.send("sylee is definitely shown ! and other string is optional !")
})

// 순수 정규표현식 사용 // 사이에 작성
// app.get(/^\/users\/(\d{4})$/, (req, res) => {
//     console.log(req.params)
//     res.send(`user id ${req.params[0]} found successfully !`)
// })
app.get('/users/:userId([0-9]{4})', (req, res) => {
    console.log(req.params.userId)
    res.send(`user id ${req.params.userId} found successfully !`)
})

// 2개 이상의 라우트 핸들러로 하나의 url을 처리
// 마지막 핸들러는 next가 없고 나머지 핸들러는 next가 있어야한다.
app.get(
    "/users/:name/comments",
    (req, res, next) => {
        if (req.params.name !== "syleemomo") {
            // 401 - 권한이 없다.
            res.status(401).send("you are not authorized to this page !")
        }
        next()
    },
    (req, res) => {
        // 댓글 수정 페이지 보여주기
        res.send("this is page o update your comments!") 
    }
)

// 2개 이상의 라우트 핸들러를 배열에 담아서 한아의 url을 처리할 수 있다.
const blockFirestUser = (req, res, next) => {
    if (req.params.name === "kim") {
        res.status(401).send("you are not authorized to this page !")
    }
    next()
}
const blockSecondUser = (req, res, next) => {
    if (req.params.name === "park") {
        res.status(401).send("you are not authorized to this page !")
    }
    next()
}
const allowThisUser = (req, res) => {
    res.send("you can see this home page !")
}
app.get("/home/users/:name", [blockFirestUser, blockSecondUser, allowThisUser])

// next 콜백 함수
// 같은 url에서 특정 조건에 따라 서로 다른 로직을 처리
app.get("/chance", (req, res, next) => {
    if (Math.random() < 0.5) return next()
    res.send("first one")
})
app.get("/chance", (req, res) => {
    res.send("second one")
})

// next 콜백 함수 활용
app.get(
    "/fruits/:name",
    (req, res, next) => {
        if (req.params.name !== "apple") return next()
        res.send("[logic 1] you choose apple your favorite fruit !")
    },
    (req, res, next) => {
        if (req.params.name !== "banana") return next()
        res.send("[logic 2] you choose banana your favorite fruit !")
    },
    (req, res) => {
        res.send(`[logic 3] you choose ${req.params.name} for your favorite fruit !`)
    }
)

// 요청 객체
// html get방식 사용법과 같은듯? 주소?속성=값
app.get("/shirts", (req, res) => {
    res.send(`feature - color : ${req.query.color} / size : ${req.query.size}`)
})

// 응답 객체
// app.get("/hello", (req, res) => {
//     res.send(
//         `<html>
//             <head></head>
//             <body>
//                 <h1>Hello world !</h1>
//                 <input type='button' value='Submit'/>
//             </body>
//         </html>`)
// })
// app.get("/hello", (req, res) => { // json을 응답
//     res.json({user: "syleemomo", msg: "hello !"})
// })
// redirect 사이트로 바로 넘겨버린다.
app.get("/google", (req, res) => { 
    res.redirect("https://google.com")
})
// redirect를 이용해서 html문서를 클라이언트에게 응답
app.get("/home", (req, res) => { 
    res.redirect("/static/index.html")
})
// url주소를 통해서 파일을 응답해준다. 제일 편한 방법인듯하다.
app.get("/aaa", (req, res) => { 
    res.sendfile('./public/aaa.html') // "__dirname+'/public/aaa.html'"
})










app.use((req, res, next) => { // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})

app.use( (err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})

app.listen(5000, () => { // 5000 포트로 서버 오픈
    console.log('server is running on port 5000 ...')
})