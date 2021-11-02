const mongoose = require('mongoose');
const ExcelRecord = require('../models/excelRecords');
const Auth = require('../models/auth');
const Employe = require('../models/employes');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs')
const mongoXlsx = require('mongo-xlsx');


module.exports.insert = async (req, res, next) => {

    const id = req.body.authId;

    const file = req.file.path;

    const workbook = await xlsx.readFile(file);
    var employesList = [];
    // console.log(workbook)
    var sheet_name_list = workbook.SheetNames;
    var xlData = await xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    console.log(xlData);

    var employeLoop = 0;

    Employe.find({ company: id })
        .exec()
        .then(async employees => {
            if (employees.length > 0) {
                await Employe.remove({ company: id })
                    .exec();
            }

            await xlData.forEach(async employe => {

                const employee = new Employe({
                    _id: mongoose.Types.ObjectId(),
                    employeName: employe.employes,
                    company: id
                })
                employee.save();
                employeLoop++;

                if (employeLoop == xlData.length) {
                    res.status(201).json({
                        message: "file saved successfully",
                        file: file
                    })
                }

            })
        })

}
module.exports.get = async (req, res, next) => {
    var emploeesList = [];
    var tempObj = [{ Name: "vgf", LastSelected: "gvcgb", SelectedAfterLastReset: false }];
    var i = 0;
    const id = req.params.id;
    var isBlocked;
    await Auth.findById(id)
        .exec()
        .then(authObj => {
            console.log(authObj)
            if (authObj.isBlocked) {
                return res.status(401).json({
                    message: 'Auhorization error! Your access has been blocked!'
                });
            }
            else {
                Employe.find({ company: id })
                    .select('employeName isSelectedAfterLastReset lastSelected')
                    .sort({ _id: 1 })
                    .exec()
                    .then(async employees => {
                        employees.forEach(employe => {
                            tempObj[i] = { Name: employe.employeName, LastSelected: employe.lastSelected, SelectedAfterLastReset: employe.isSelectedAfterLastReset ? "Yes" : "No" };
                            emploeesList.push(tempObj[i]);
                            i++;
                        })
                        var model = mongoXlsx.buildDynamicModel(emploeesList);

                        await mongoXlsx.mongoData2Xlsx(emploeesList, model, function (err, data) {
                            const filePath = ({ root: path.join(__dirname, `../../${data.fullPath}`) });
                            console.log(filePath)
                            res.sendFile(filePath.root);
                        })

                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
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






module.exports.update = (req, res, next) => {
    const id = req.params.id;
    const file = req.file.path;
    ExcelRecord.findOne({ auth: id })
        .exec()
        .then(excel => {
            if (excel) {
                excel.file = file;
                excel.save()
                    .then(ex => {
                        res.status(201).json({
                            message: "file updated successfully",
                            file: ex
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            }
            else {
                res.status(404).json({
                    message: "no file found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })


}

