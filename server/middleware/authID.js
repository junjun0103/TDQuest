const { user } = require("../models")

module.exports = { //oauth ID 검증
    
    existID : async (email) => {
        const userInfo = await user.findOne({
            email : email
        })
        if (userInfo) {
            return userInfo
        }
    },

    signID : async (userInfo) => {
        await user.create({
            email : userInfo.email,
            name : userInfo.nickname
        })
        res.redirect("http://localhost:3000")
    }
}
