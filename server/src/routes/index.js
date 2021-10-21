const express = require('express') // 외부 모듈 express를 불러온다.
const router = express.Router() // 라우터 기본 세팅 express생성
const todo = require('./todo') // todo경로의 파일을 사용하겠다.

router.use('/todos', todo) // todos를 라우팅 / 서브URL로 /todos를 사용하겠다.

module.exports = router // 라우터 기본 세팅