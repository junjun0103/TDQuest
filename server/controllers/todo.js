const { todo_list } = require("../models")
const { user } = require("../models")
const { damage_log } = require('../models')
const { monster } = require("../models")
const { character } = require("../models")
const { sequelize } = require("../models")
const bcrypt = require("bcrypt")

module.exports = {
    createTodo: async (req, res) => {
        try {
            const todoInfo = await todo_list.create({
                kind: req.body.kind,
                content: req.body.content,
                user_id: req.body.user_id
            })
            res.status(201).json({ todoInfo: todoInfo, message: "todo_list를 추가합니다" })
        }
        catch (err) {
            res.status(401).json({ message: 'Not Found' })
        }
    }, //todolist 추가

    deleteTodo: async (req, res) => {
        try {
            const todoInfo = await todo_list.findOne({ where: { id: req.query.id } })
            await todo_list.destroy({
                where: { id: req.query.id }
            })
            res.status(200).json({ todoInfo: todoInfo, message: "삭제했습니다." })
        }
        catch (err) {
            res.status(400).json({ message: err })
        }
    },

    updateTodo: async (req, res) => {
        try {
            await todo_list.update({
                kind: req.body.kind,
                content: req.body.content
            }, { where: { id: req.query.id } })
                .then(async data => {
                    const todoInfo = await todo_list.findOne({ where: { id: req.query.id } })
                    res.status(200).json({ message: "수정되었습니다.", todoInfo: todoInfo })
                })
        }
        catch (err) {
            console.log(err)
            res.status(401).json({ message: 'Not Found' })
        }
    },


    incompleteList: async (req, res) => {
        try { //미완료
            if (req.query.time) { //시간있을경우
                const todo_lists = await todo_list.findAll({
                    where: {
                        user_id: req.query.user_id,
                        updatedAt: req.query.time,
                        is_complete: 0
                    }
                })
                res.status(200).json({ todoInfo: todo_lists })
            }
            else { // 없을경우 
                const todoInfo = await todo_list.findAll({
                    where: {
                        user_id: req.query.user_id,
                        is_complete: 0
                    }
                })
                res.status(200).json({ todoInfo: todoInfo })
            }
        }
        catch (err) {
            res.status(400).json({ message: err })
        }
    }, // 완료되지않은 todolist 불러오기

    completeList: async (req, res) => {
        try {
            if (req.query.time) { // 특정 날짜
                const todo_lists = await todo_list.findAll({
                    where: {
                        user_id: req.query.user_id,
                        updatedAt: req.query.time,
                        is_complete: 1,
                    }
                })
                res.status(200).json({ todoInfo: todo_lists })
            }
            else { // 
                const todo_lists = await todo_list.findAll({
                    where: {
                        user_id: req.query.user_id,
                        is_complete: 1
                    }
                })
                res.status(200).json({ todo_lists: todo_lists })
            }
        }
        catch (err) {
            res.status(400).json({ message: err })
        }
    },

    completeTodo: async (req, res) => {

        if (!req.query.raid_id) {
            if (req.query.is_complete === '1') { //완료버튼을 눌렀다면
                try {
                    let todoInfo = ''
                    await todo_list.update({ is_complete: 1 },
                        {
                            where: {
                                id: req.query.id,
                                is_complete: 0
                            }
                        })
                        .then(async data => {
                            todoInfo = await todo_list.findOne({
                                where: { id: req.query.id }
                            })
                        })

                    if (req.query.status === "phy") {
                        await character.increment(
                            { status_phy: 1 },
                            {
                                where: { user_id: req.query.user_id }
                            })
                    }
                    else if (req.query.status === "int") {
                        await character.increment(
                            { status_int: 1 },
                            { where: { user_id: req.query.user_id } }
                        )
                    }
                    else if (req.query.status === "spi") {
                        await character.increment(
                            { status_spi: 1 },
                            {
                                where: { user_id: req.query.user_id }
                            })
                    }
                    else if (req.query.status === "exp") {
                        await character.increment(
                            { totalExp: 1 },
                            {
                                where: { user_id: req.query.user_id }
                            })

                    }

                    const characterInfo = await character.findOne({ where: { user_id: req.query.user_id } })
                        .then(data => {
                            if (data === null) {
                                throw err
                            }
                            else {
                                return {
                                    ...data.dataValues,
                                    level: data.dataValues.totalExp / 100,
                                    exp: data.dataValues.totalExp % 100
                                }
                            }
                        })


                    res.status(200).json({
                        characterInfo: characterInfo,
                        todoInfo: todoInfo
                    })
                }
                catch (err) {
                    ;
                    res.status(400).json({ message: "실패" })
                }
            }
            else {//취소할 떄
                try {
                    let todoInfo = ''
                    await todo_list.update({ is_complete: false },
                        {
                            where: {
                                id: req.query.id,
                                is_complete: true
                            }
                        }).then(async data => {
                            todoInfo = await todo_list.findOne({
                                where: { id: req.query.id }
                            })
                        })

                    if (req.query.status === "phy") {
                        await character.decrement(
                            { status_phy: 1 },
                            {
                                where: { user_id: req.query.user_id }
                            })
                    }
                    else if (req.query.status === "int") {
                        await character.decrement(
                            { status_int: 1 },
                            { where: { user_id: req.query.user_id } })

                    }
                    else if (req.query.status === "spi") {
                        await character.decrement(
                            { status_spi: 1 },
                            { where: { user_id: req.query.user_id } })

                    }
                    else if (req.query.status === "exp") {
                        await character.decrement(
                            { totalExp: 1 },
                            { where: { user_id: req.query.user_id } })

                    }

                    const characterInfo = await character.findOne(
                        { where: { user_id: req.query.user_id } })
                        .then(data => {
                            return {
                                ...data.dataValues,
                                level: data.dataValues.totalExp / 100,
                                exp: data.dataValues.totalExp % 100
                            }
                        })
                    res.status(200).json({
                        characterInfo: characterInfo,
                        todoInfo: todoInfo
                    })

                }
                catch (err) {

                    res.status(400).json({ message: "실패" })
                }
            }
        }

        else { //레이드 참가
            if (req.query.is_complete === '1') {
                try {
                    let todoInfo = ''
                    let damage_logInfo = ''
                    // 유저 스탯 비례하여 데미지를 주는 코드 추가 (stat * 1)
                    let damage = 1                    
                    let characterStat = {} 
                    await character.findOne({ where: { user_id: req.query.user_id } })
                    .then(data => {            
                        characterStat = data.dataValues;                        
                    })
                    const { status_phy, status_int, status_spi, totalExp, medal } = characterStat

                    await todo_list.update({ is_complete: 1 },
                        {
                            where: {
                                id: req.query.id,
                                is_complete: 0
                            }
                        }).then(async data => {
                            todoInfo = await todo_list.findOne({
                                where: { id: req.query.id }
                            })
                        })

                    if (req.query.status === "phy") {
                        await character.increment(
                            { status_phy: 1 },
                            { where: { user_id: req.query.user_id } })
                        damage = 1 * status_phy;
                    }
                    else if (req.query.status === "int") {
                        await character.increment(
                            { status_int: 1 },
                            { where: { user_id: req.query.user_id } })
                        damage = 1 * status_int;
                    }
                    else if (req.query.status === "spi") {
                        await character.increment(
                            { status_spi: 1 },
                            { where: { user_id: req.query.user_id } })
                        damage = 1 * status_spi;
                    }
                    else if (req.query.status === "exp") {
                        await character.increment(
                            { totalExp: 1 },
                            { where: { user_id: req.query.user_id } })
                        damage = 1 * Math.floor(totalExp / 100);
                    }

                    await damage_log.create(
                        {
                            log: damage,
                            user_id: req.query.user_id,
                            raid_id: req.query.raid_id
                        })
                        .then(data => {
                            damage_logInfo = data.dataValues
                        })

                    await monster.decrement(
                        { hp: damage },
                        { where: { id: req.query.raid_id } })


                    const monsterInfo = await monster.findOne({ where: { id: req.query.raid_id } })
                    if (monsterInfo.dataValues.hp <= 0) { // 몬스터를 잡았을 때
                        const characterArray = await character.findAll(
                            {
                                include: {
                                    model: user,
                                    include: {
                                        model: damage_log,
                                        where: { raid_id: req.query.raid_id } //raid 참가한 인원
                                    },
                                    required: true
                                }
                            })
                        characterArray.forEach(el => {
                            character.increment({
                                totalExp: monsterInfo.dataValues.reward
                            },
                                { where: { id: el.dataValues.id } })
                            // 보스 몬스터 잡았을 경우 참가한 유저들에게 업적 부여하는 코드 추가
                            if (medal === null) {
                                character.update({
                                    medal: monsterInfo.dataValues.name
                                }, { where: { id: el.dataValues.id } })
                            } else {
                                character.update({
                                    medal: medal.concat(`,${monsterInfo.dataValues.name}`)
                                }, { where: { id: el.dataValues.id } })
                            }
                        })
                        const todoInfo = await todo_list.findOne({ where: { id: req.query.id } })
                        const characterInfo = await character.findOne({ where: { user_id: req.query.user_id } })
                            .then(data => {
                                return {
                                    ...data.dataValues,
                                    level: data.dataValues.totalExp / 100,
                                    exp: data.dataValues.totalExp % 100                                    
                                }
                            })
                        await monster.update({reward: 0},{ where: { id: req.query.raid_id } });

                        res.status(200).json({ message: "몬스터를 잡았습니다", todoInfo: todoInfo, characterInfo: characterInfo, damage_logInfo: damage_logInfo })

                    }

                    else { //monster를 잡지못하고 데미지만 넣었을 때
                        const todoInfo = await todo_list.findOne({ where: { id: req.query.id } })
                        const characterInfo = await character.findOne({ where: { user_id: req.query.user_id } })
                            .then(data => {
                                return {
                                    ...data.dataValues,
                                    level: data.dataValues.totalExp / 100,
                                    exp: data.dataValues.totalExp % 100
                                }
                            })

                        res.status(200).json({ message: "데미지를 넣었습니다", todoInfo: todoInfo, characterInfo: characterInfo, damage_logInfo: damage_logInfo })
                    }

                }
                catch (err) {
                    res.status(400).json({ message: "실패" })
                }
            }
            else { // 취소
                try {
                    let todoInfo = ''
                    let damage_logInfo = ''
                    
                    await todo_list.update({ is_complete: false },
                        {
                            where: {
                                id: req.query.id,
                                is_complete: true
                            }
                        })
                        .then(async data => {
                            todoInfo = await todo_list.findOne({
                                where: { id: req.query.id }
                            })
                        })
                    if (req.query.status === "phy") {
                        await character.decrement(
                            { status_phy: 1 },
                            { where: { user_id: req.query.user_id } })

                    }
                    else if (req.query.status === "int") {
                        await character.decrement(
                            { status_int: 1 },
                            { where: { user_id: req.query.user_id } })

                    }
                    else if (req.query.status === "spi") {
                        await character.decrement(
                            { status_spi: 1 },
                            { where: { user_id: req.query.user_id } })

                    }
                    else if (req.query.status === "exp") {
                        await character.decrement(
                            { totalExp: 1 },
                            { where: { user_id: req.query.user_id } })

                    }

                    await damage_log.findOne({
                        where: {
                            user_id: req.query.user_id,
                            raid_id: req.query.raid_id
                        },
                        include: {
                            model: user,
                            include: {
                                model: todo_list,
                                where: { id: req.query.id }
                            }
                        }
                    }).then(async data =>
                        await damage_log.destroy(
                            {
                                where: { id: data.dataValues.id }
                            })
                    )

                    await monster.increment(
                        { hp: 1 },
                        { where: { id: req.query.raid_id } })



                    const monsterInfo = await monster.findOne({ where: { id: req.query.raid_id } })


                    if (monsterInfo.dataValues.hp === 0) {
                        const characterArray = await character.findAll(
                            {
                                include: {
                                    model: user,
                                    include: {
                                        model: damage_log,
                                        where: { raid_id: req.query.raid_id } //raid 참가한 인원
                                    },
                                    required: true
                                }
                            })
                        characterArray.forEach(el => {
                            character.decrement({
                                totalExp: monsterInfo.dataValues.reward
                            },
                                { where: { id: el.dataValues.id } })
                        })
                        const todoInfo = await todo_list.findOne({ where: { id: req.query.id } })
                        const characterInfo = await character.findOne({ where: { user_id: req.query.user_id } })
                            .then(data => {
                                return {
                                    ...data.dataValues,
                                    level: data.dataValues.totalExp / 100,
                                    exp: data.dataValues.totalExp % 100
                                }
                            })

                        res.status(200).json({ message: "취소합니다", todoInfo: todoInfo, characterInfo: characterInfo })
                    }
                    else {
                        const todoInfo = await todo_list.findOne({ where: { id: req.query.id } })
                        const characterInfo = await character.findOne({ where: { user_id: req.query.user_id } })
                            .then(data => {
                                return {
                                    ...data.dataValues,
                                    level: data.dataValues.totalExp / 100,
                                    exp: data.dataValues.totalExp % 100
                                }
                            })

                        res.status(200).json({ message: "취소합니다", todoInfo: todoInfo, characterInfo: characterInfo })
                    }
                }
                catch (err) {
                    console.log(err)
                    res.status(400).json({ message: "실패" })
                }
            }
        }
    }
}