const Employe = require('../models/employes');
const mongoose = require('mongoose');

module.exports.getAll = (req, res, next) => {
    const id = req.params.id;

    Employe.find({ company: id })
        .sort({ _id: 1 })
        .exec()
        .then(employees => {
            res.status(200).json({
                count: employees.length,
                employees: employees
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}


module.exports.addEmployee = (req, res, next) => {
    const company = req.params.id;
    const employeName = req.body.employeName;

    console.log(employeName);
    console.log(company);


    const employee = new Employe({
        _id: mongoose.Types.ObjectId(),
        employeName: employeName,
        company: company
    })

    employee.save()
        .then(employeObj => {

            if (employeObj) {
                Employe.find({ company: company })
                    .exec()
                    .then(employesList => {
                        res.status(201).json({
                            message: "employe saved successfully",
                            newEmployee: employeObj,
                            employes: employesList
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    })
            }
            else {
                res.status(403).json({
                    message: "couldn't add employee",
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

}
module.exports.removeEmployee = (req, res, next) => {

    const id = req.params.id;


    Employe.remove({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(201).json({
                    message: "employe deleted successfully"
                })
            }
            else {
                res.status(404).json({
                    message: "no employee found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}




module.exports.trueRandomSelection = (req, res, next) => {

    const id = req.params.id;

    Employe.find({ company: id })
        .exec()
        .then(employees => {
            var date = new Date();
            var day = date.getDay();
            var month = date.getMonth() + 1;
            var year = date.getFullYear()
            var dateStr = `${day}-${month}-${year}`
            const index = Math.floor(Math.random() * employees.length - 1);
            const employe = employees[index];
            employe.isSelectedAfterLastReset = true;
            employe.lastSelected = dateStr;
            employe.save()
                .then(employeeObj => {
                    res.status(200).json({
                        employee: employeeObj
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

module.exports.sequentialRandomSelection = (req, res, next) => {
    const id = req.params.id;

    Employe.find({ company: id, isSelectedAfterLastReset: false })
        .exec()
        .then(employees => {
            var date = new Date();
            var day = date.getDay();
            var month = date.getMonth() + 1;
            var year = date.getFullYear()
            var dateStr = `${day}-${month}-${year}`
            const index = Math.floor(Math.random() * employees.length - 1);
            const employe = employees[index];
            employe.isSelectedAfterLastReset = true;
            employe.lastSelected = dateStr;

            employe.save()
                .then(employeeObj => {
                    res.status(200).json({
                        employee: employeeObj
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

module.exports.sequentialFlagReset = (req, res, next) => {
    console.log("ok");
    const id = req.params.id;
    console.log(id)
    var employesLoop = 0;
    Employe.find({ company: id, isSelectedAfterLastReset: true })
        .exec()
        .then(async employees => {
            await employees.forEach(async employe => {
                employe.isSelectedAfterLastReset = false;
                await employe.save()
                    .then(obj => {
                        if (employesLoop == employees.length - 1) {
                            console.log("okdf");
                            Employe.find({ company: id })
                                .sort({ _id: 1 })
                                .exec()
                                .then(list => {
                                    res.status(200).json({
                                        count: list.length,
                                        employees: list
                                    })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    })
                                })
                        }
                        employesLoop++;

                    })
                    .catch(err => {
                        res.status(500).json(
                            {
                                error: err
                            }
                        )
                    })

                    ;
            })



        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })


}           
