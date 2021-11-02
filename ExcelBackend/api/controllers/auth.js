const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');
const Role = require('../models/roles')
const saltRounds = 10;
const nodemailer = require('nodemailer');

module.exports.getUsers = async (req, res, next) => {
    Auth.find()
        .populate('role')
        .exec()
        .then(auth => {
            res.status(200).json({
                count: auth.length,
                users: auth
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

module.exports.getCustomers = async (req, res, next) => {
    var roleId;
    await Role.findOne({ name: "customer" })
        .exec()
        .then(roleObj => {
            roleId = roleObj._id;
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });


    Auth.find({ role: roleId })
        .exec()
        .then(auth => {
            res.status(200).json({
                count: auth.length,
                users: auth
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}



module.exports.signup = (req, res, next) => {
    console.log(req.body);

    const { title, firstName, lastName, companyName, streetAddress1, streetAddress2, town, county, country, postCode, workTel, mobileTel, email, password, roleId } = req.body;
    const isAdmin = false;
    var hashp;

    Auth.findOne({ email: email })
        .exec()
        .then(async authObj => {
            if (authObj) {
                res.status(403).json({
                    message: "email already registered"
                })
            }
            else {
                await bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }

                    else {


                        const token = jwt.sign({ title, firstName, lastName, companyName, streetAddress1, streetAddress2, town, county, country, postCode, workTel, mobileTel, email, password, roleId, isAdmin }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '20m' });

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.user,
                                pass: process.env.pass
                            }
                        });

                        var mailOptions = {
                            from: process.env.email,
                            to: `${email}`,
                            subject: 'Account activation link',
                            html: ` 
                                <h2>please click on the following link to activate your account</h2>
                                <a href="http://192.168.18.9:3001/active/${token}"> ${process.env.CLIENT_URL}/auth/activate/${token} </a>
                                `
                        };

                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    res.status(201).json({
                        message: "please check your email for account activation"
                    })
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}



module.exports.signupAdmin = async (req, res, next) => {
    console.log(req.body);
    var roleId;

    const { email, password } = req.body;
    var hashp;


    var role = await Role.findOne({ name: "admin" }).exec();
    roleId = role._id;
    console.log(roleId);

    Auth.findOne({ email: email })
        .exec()
        .then(async authObj => {
            if (authObj) {
                res.status(403).json({
                    message: "email already registered"
                })
            }
            else {
                await bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }

                    else {

                        hashP = hash

                        const auth = new Auth({
                            _id: mongoose.Types.ObjectId(),
                            email: email,
                            password: hash,
                            role: roleId,
                        });

                        auth.save()
                            .then(async authObj => {
                                const id = authObj._id;
                                const email = authObj.email;
                                const password = authObj.password;
                                const role = authObj.role;
                                const isAdmin = true;

                                var token = await jwt.sign({ id, email, password, role, isAdmin }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' })

                                res.status(201).json({
                                    message: "sign up successful",
                                    token: token
                                })



                            })
                    }



                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


module.exports.activate = (req, res, next) => {
    const { token } = req.body;
    var hashP;
    if (token) {
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, async function (err, decodeToken) {
            const { title, firstName, lastName, companyName, streetAddress1, streetAddress2, town, county, country, postCode, workTel, mobileTel, email, password, roleId } = decodeToken;
            await bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        error: err
                    })
                }
                else {

                    hashp = hash;
                    const auth = new Auth({
                        _id: mongoose.Types.ObjectId(),
                        title: title,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: hashp,
                        role: roleId,
                        companyName: companyName,
                        streetAddress1: streetAddress1,
                        streetAddress2: streetAddress2,
                        town: town,
                        county: county,
                        country: country,
                        postCode: postCode,
                        workTel: workTel,
                        mobileTel: mobileTel
                    });

                    auth.save()
                        .then(async authObj => {
                            const id = authObj._id;
                            const firstName = authObj.firstName;
                            const lastName = authObj.lastName;
                            const title = authObj.title;
                            const email = authObj.email;
                            const password = authObj.hashp;
                            const role = authObj.role;
                            const companyName = authObj.companyName;
                            const streetAddress1 = authObj.streetAddress1;
                            const streetAddress2 = authObj.streetAddress2;
                            const town = authObj.town;
                            const county = authObj.county;
                            const country = authObj.country;
                            const postCode = authObj.postCode;
                            const workTel = authObj.workTel;
                            const mobileTel = authObj.mobileTel;
                            const isAdmin = false;

                            var token = await jwt.sign({ id, title, firstName, lastName, companyName, streetAddress1, streetAddress2, town, county, country, postCode, workTel, mobileTel, email, password, role, isAdmin }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' })

                            res.status(201).json({
                                message: "sign up successful",
                                token: token
                            })

                        })
                        .catch(err => {
                            res.status(500).json({
                                error: err
                            })
                        })
                }
            });

        })
    }
    else {
        return res.status(500).json({
            message: "no token exists"
        })
    }

}

module.exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Auth.findOne({ email: email })
        .exec()
        .then(async auth => {
            if (auth) {
                if (auth.isBlocked == false) {
                    await bcrypt.compare(password, auth.password, async function (err, newResult) {
                        if (err) {
                            return res.status(501).json({
                                error: err
                            })
                        }
                        else {
                            if (newResult) {

                                var role2 = await Role.findOne({ _id: auth.role }).exec();
                                console.log(role2)
                                var roleName = role2.name;
                                console.log(roleName);
                                var isAdmin = roleName == "admin" ? true : false
                                console.log(isAdmin);
                                if (isAdmin) {
                                    const id = auth._id;
                                    const email = auth.email;
                                    const password = auth.password;

                                    const token = await jwt.sign({
                                        id, email, password, isAdmin
                                    }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' })
                                    return res.status(200).json({
                                        token: token,
                                        user: auth
                                    })


                                }
                                else {
                                    const id = auth._id;
                                    const title = auth.title;
                                    const firstName = auth.firstName;
                                    const lastName = auth.lastName;
                                    const email = auth.email;
                                    const password = auth.password;
                                    const role = auth.role;
                                    const companyName = auth.companyName;
                                    const streetAddress1 = auth.streetAddress1;
                                    const streetAddress2 = auth.streetAddress2;
                                    const town = auth.town;
                                    const county = auth.county;
                                    const country = auth.country;
                                    const postCode = auth.postCode;
                                    const workTel = auth.workTel;
                                    const mobileTel = auth.mobileTel;
                                    const isBlocked = auth.isBlocked;
                                    const token = await jwt.sign({ id, title, firstName, lastName, companyName, streetAddress1, streetAddress2, town, county, country, postCode, workTel, mobileTel, email, password, role, isBlocked, isAdmin }, process.env.JWT_SESSION_KEY, { expiresIn: '60d' })
                                    return res.status(200).json({
                                        token: token,
                                        user: auth
                                    })

                                }


                            }
                            else {
                                return res.status(401).json({
                                    message: "invalid password"
                                })
                            }
                        }

                    })
                }
                else{
                    res.status(401).json({
                        message: "Auhorization error! Your access has been blocked!"
                    })
                }
            }
            else {
                res.status(404).json({
                    message: "email invalid"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}



module.exports.block = (req, res, next) => {
    console.log(req);
    const id = req.params.id;
    Auth.findById(id)
        .exec()
        .then(auth => {
            auth.isBlocked = true;
            auth.save()
                .then(authObj => {
                    res.status(201).json({
                        message: "user blocked successfully",
                        user: authObj
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


module.exports.unblock = (req, res, next) => {
    const id = req.params.id;
    Auth.findById(id)
        .exec()
        .then(auth => {
            auth.isBlocked = false;
            auth.save()
                .then(authObj => {
                    res.status(201).json({
                        message: "user unblocked successfully",
                        user: authObj
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}



module.exports.updatePassword = (req, res, next) => {
    console.log("request received")
    const id = req.params.id;
    const password = req.body.password;
    const oldPassword = req.body.oldPassword;
    Auth.findById(id)
        .exec()
        .then(async auth => {
            await bcrypt.compare(oldPassword, auth.password, async function (err, newResult) {
                if (err) {
                    return res.status(501).json({
                        error: err
                    })
                }
                else {
                    if (newResult) {
                        await bcrypt.hash(password, saltRounds, function (err, hash) {
                            if (err) {
                                console.log(err)
                                return res.status(500).json({
                                    error: err
                                })
                            }
                            else {
                                auth.password = hash;
                                auth.save()
                                    .then(authObj => {
                                        res.status(201).json({
                                            message: "password updated successfully"
                                        })
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            error: err
                                        })
                                    })

                            }

                        })
                    }

                    else {
                        return res.status(401).json({
                            message: "incorrect old password"
                        })
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}