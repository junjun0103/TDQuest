const jwt = require('jsonwebtoken')
const { user } = require('../models')
const { character } = require("../models")
const { makeAccessToken } = require('../middleware/token');

module.exports = {
    signIn : async (req, res) => {
        const { email, nickname, password } = req.body
        const passwordToken = makeAccessToken(password)

        const isUser = await user.findOne({
            where : {email : email}
        })
        if (isUser) {
            res.status(409).json({message: "이미 아이디가 있습니다."})
        }
        else {
            await user.create({
             email: email,
             nickname: nickname,
             password: passwordToken
            })

            await user.findOne({ where : {
                email : req.body.email
            }})
            .then(data => {
                const characterInfo = character.create({
                    user_id : data.dataValues.id
                })
            res.status(200).json({ message : "회원가입 성공"})
        })
        }
    },

  signOut: async (req, res) => {
    user.destory({ where: { id: req.query.id } });
    res.status(200);
  },
};
