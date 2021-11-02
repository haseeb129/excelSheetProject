const mongoose = require('mongoose');

const Role = require('../models/roles');

module.exports.getAll = (req, res, next) => {
    Role.find()
        .exec()
        .then(roles => {
            res.status(200).json({
                count: roles.length,
                roles: roles
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
module.exports.insert = (req, res, next) => {

    const name = req.body.name;

    const role = new Role({
        _id: mongoose.Types.ObjectId(),
        name: name
    })

    role.save()
        .then(roleObj => {
            res.status(201).json({
                message: "role saved successfully",
                role : roleObj
            })
        })
        .catch()

}      