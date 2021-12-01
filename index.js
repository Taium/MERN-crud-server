const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const fileUpload = require('express-fileupload');
var mysql = require('mysql');

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

const port = 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'interview'
});

app.get('/readdata', function (req, res) {
    dbConn.query('SELECT * FROM category', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Category table is empty";
        else
            message = "Successfully retrived all books";

        return res.send({ data: results });
    });
});
app.get('/readadddata', function (req, res) {
    dbConn.query('SELECT * FROM category_add', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Category table is empty";
        else
            message = "Successfully retrived all books";

        return res.send({ data: results });
    });
});
app.get('/readDataSubCategory/:id', function (req, res) {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide enter id' });
    }
    dbConn.query(`SELECT * FROM sub_category_list WHERE category_id =${id}`, function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Category table is empty";
        else
            message = "Successfully retrived all books";

        return res.send({ data: results });
    });
});

app.post('/addCategory', function (req, res) {


    let category = req.body.category;
    console.log(req.body.category)
    // validation
    if (!category)
        return res.status(400).send({ error: true, message: 'Please provide book country and capital' });

    // insert to db
    dbConn.query("INSERT INTO category_add (categoryname) VALUES (?)", [category], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Book successfully added' });
    });
});

app.delete('/datadelete', function (req, res) {
    let id = req.body.id;

    dbConn.query('DELETE FROM category_add where id=?', id, function (err, results) {
        if (err) { throw err }
        let message = "";
        if (results.affectedRows == 0) {
            message = "book not found"
        }
        else {
            message = "book successfully delete"
        }
        return res.send({ data: results[0], message: message })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})