const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql');
const port = 3001;


const corsOptions = {
    origin: `${process.env.CLIENT_ADDRESS}`,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


const con = mysql.createConnection({
    host: process.env.MySQL_HOST,
    user: process.env.MySQL_USER,
    password: process.env.MySQL_PASS,
    socketPath: process.env.MySQL_SOCKET,
    database: process.env.MySQL_DATABASE
});

con.connect(function (err) {
    if (err) throw err;
    console.log('Connected');
});

app.get('/test', (req, res) => {
    const sql = "select * from users"
    con.query(sql, (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });
});

app.get('/serch-id', (req, res) => {
    const id = req.query.id;
    const sql = "select * from users where id = ?"
    con.query(sql, [id], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });
});

app.get('/getLogin', (req, res) => {
    const id = req.query.id;
    const password = req.query.password;
    const sql = "select exists(select * from users where id = ? and password = ?) as check_user"
    con.query(sql, [id, password], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows[0].check_user);
        if (rows[0].check_user == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});
