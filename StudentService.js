const express = require("express");
const app = express();
const path = require('path');
const mysql = require('mysql2');
const dotenv = require("dotenv");
const router = express.Router();

app.use("/", router);

dotenv.config();
console.log("fsdfsdf")

var connection = mysql.createConnection({
    host : process.env.host,
    user : process.env.DB_user,
    password : process.env.DB_pass,
    database : process.env.DB_name
    });

    connection.connect(function(err){
    if(err) throw err;
    console.log(`Connected DB: ${process.env.DB_name}`);
    });

    router.get('/student', (req, res) => {
        let sql= `select * from  personal_info;`
        connection.query( sql, function (error, results) {
        if (error) throw error;
            return res.send({ error: false, data: results, message: 'Student list.' });
        });
    });
    router.get('/student/:id', function (req, res) {
        let student_id = req.params.id;
        if (!student_id) {
        return res.status(400).send({ error: true, message: 'Please provide student id.' });
        }
        connection.query('SELECT * FROM personal_info where STU_ID=?', student_id, function (error, results) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Student retrieved' });
        });
    });

    // fixing bc i can the body in the post man
    // "personal_infro"[{"stu_id": 4,
    // "fname": "Nuttipong",
    // "lname": "Wattanaboonma",
    // "birthdate": "2004-08-20",
    // "phone": "0931371689"}]

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }));

    router.post('/student', function (req, res) {
        let student = req.body.personal_info;
        console.log(student);
        if (!student) {
        return res.status(400).send({ error: true, message: 'Please provide student information' });
        }
        connection.query("INSERT INTO personal_info SET ? ", student, function (error, results) {
        if (error) throw error;
        return res.send({error: false, data: results.affectedRows, message: 'New student has been created successfully.'});
        });
    });

    router.put('/student', function (req, res) {
        let student_id = req.body.personal_info.stu_id;
        let student = req.body.personal_info;
        if (!student_id || !student) {
        return res.status(400).send({ error: student, message: 'Please provide student information' });
        }
        connection.query("UPDATE personal_info SET ? WHERE STU_ID = ?", [student, student_id], function (error,
        results) {
        if (error) throw error;
        return res.send({error: false, data: results.affectedRows, message: 'Student has been updated successfully.'})});
        });
    
    router.delete('/student', function (req, res) {
            let student_id = req.body.id;
            // console.log(student_id);
            if (!student_id) {
            return res.status(400).send({ error: true, message: 'Please provide student_id' });
            }
            connection.query('DELETE FROM personal_info WHERE STU_ID = ?', [student_id], function (error, results){
            if (error) throw error;
            return res.send({ error: false, data: results.affectedRows, message: 'Student has been deleted successfully.' });
            });
        });
        
    app.listen(process.env.PORT, function() {
        console.log("Server listening at Port " 
    + process.env.PORT);
    });
