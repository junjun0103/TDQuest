const express = require("express");
const router = express.Router();

const character = require("../controllers/character");
const log = require("../controllers/log");
const kakao = require("../controllers/oauth/kakao")
const google = require("../controllers/oauth/google")
const monster = require("../controllers/monster");
const raids = require("../controllers/raids");
const rank = require("../controllers/rank");
const sign = require("../controllers/sign");
const todo = require("../controllers/todo");
const userInfo = require("../controllers/userInfo");


//character
router.get("/character", character.getCharacter);
router.put("/character", character.updateStatus);

//log
router.post("/log/in", log.login);
router.post("/log/out", log.logout);

//log kakao
router.get("/kakao", kakao.kakao);
router.get("/kakao/callback", kakao.callback)

//log google
router.get("/google", google.google);
router.get("/google/callback", google.callback);

//monster
router.get("/monster", monster.getMonster);

//raids
router.post("/raids/invite", raids.inviteRaids);

//rank
router.get("/rank", rank.All);
router.get("/rank/status", rank.statusRank);

//sign
router.post("/sign/in", sign.signIn);
router.delete("/sign/out", sign.signOut);

//userInfo
router.get("/userInfo", userInfo.getUser);
router.patch("/userInfo", userInfo.updateUser);

//todo
router.get("/todo", todo.getTodo);
router.get("/todo/complete", todo.completeTodo)
router.post("/todo", todo.createTodo);
router.delete("/todo", todo.deleteTodo);
router.patch("/todo", todo.updateTodo);


module.exports = router;