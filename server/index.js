var express = require('express') // node_modules 내 express 관련 코드를 가져온다.
// express는 node.js 웹 애플리케이션 프레임워크 - 다양한 기능을 가지고 있다.
var app = express() // express를 객체로 생성
// 교차 출처 리소스 공유 ( Cross-Origin Resource Sharing)
// 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 
// 수 있는 권한을 부여하다록 브라우저에 알려주는 체제
var cors = require('cors')
// logger 미들웨어를 제공해주는 모듈
// morgan는 request와 response를 깔끔하게 formatting해주는 모듈이다.
// formatting된 log를 json형식으로 dump로 파일에 기록해주는 모듈인 winston과 사용하면 좋다.
var logger = require('morgan')
// Node.js와 MongoDB를 연결해주는 ODM(객체와 문서를 1대1로 매칭하는 역할)
var mongoose = require('mongoose')
// 라우트 경로 설정
var routes = require('./src/routes')

// 프레임워크의 특정 - 대소문자 구분할수 있게 해주는 모듈
app.set('case sensitive raoutin;')

// CORS 옵션 - 다른 도메인, 다른 프로토콜, 다른 포트등에서 리소스를 요청하는 방식
// 다른 사이트에서 무차별적인 리소스 공격을 막기위해서 등록 서버만 응답하기 위해 설정한다.
var corsOptions = { // localhost:3000 주소에서의 리소스 요청은 허용
    origin: 'http://localhost:3000',
    credentials: true
}

const CONNECT_URL = 'mongodb://localhost:27017/todo_project'
mongoose.connect(CONNECT_URL, { // mogoose를 이용해 MongoDB 서버 연결
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected ..."))
  .catch(e => console.log('failed to connect mongodb: ${e}'))

// 미들웨어 추가
// CORS 설정
app.use(cors(corsOptions)) 
// request body 파싱
app.use(express.json()) // post를 사용하기 위해서는 꼭 사용해야함
// Logger 설정
// morgan이 지원하는 로그 포맷 default, short, tiny, dev등이 있다.
app.use(logger('tiny')) // 최소화된 로그를 출력

app.use('/api', routes) // api 라우팅

// /hello - url을 라우트 / (req, res) => 내용이 라우트 핸들러 
// 하나의 콜백 함수는 하나의 라우트를 처리할 수 있다.
app.get('/hello', (req, res) => { // URL 응답 테스트
    res.send('hello world !')
})

// 사용자가 요청한 페이지가 없는 경우 에러처리
app.use((req, res, next) => { 
    res.status(404).send("Sorry can't find page")
})

// 서버 내부 오류 처리
app.use( (err, req, res, next) => { 
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})

// 5000 포트로 서버 오픈
app.listen(5000, () => { 
    console.log('server is running on port 5000 ...')
})

// // 만들어보기
// const points = [3, 5]
// const app = {} // 객체 리터럴 -  바로 생성이된다.
// app.doubleNums = (points) => {
//     return points.map(p => {
//         return p*p;
//     });
// }

// app.sum = (points_doubled) => {
//     let s = 0;
//     points_doubled.forEach(p => {
//         s += p;
//     })
//     return s;
// }

// app.sq = (s) => {
//     return Math.sqrt(s)
// }

// const pipeline = [app.doubleNums, app.sun, app.sq]

// const result = app.sq(app.sum(app.doubleNums(points)))
// console.log(result)