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

app.get('/login', (req, res) => {
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

app.post('/create-account', (req, res) => {
    const id = req.query.id;
    const password = req.query.password;
    const checkSql = "select exists(select * from users where id = ?) as check_user"
    const createSql = "insert into users (id, password) values (?, ?)";
    con.query(checkSql, [id, password], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows[0].check_user);
        if (rows[0].check_user == 1) {
            res.send(false);
        } else {
            con.query(createSql, [id, password], (err, rows, fields) => {
                if (err) throw err;
                console.log(rows);
                res.send(true);
            });
        };
    });
});

app.post('/create-issue', (req, res) => {
    const id = req.query.id;
    const title = req.query.title;
    const discription = req.query.discription;
    const startline = req.query.startline;
    const deadline = req.query.deadline;
    const state = 0;
    const sql = "insert into issues (id, title, discription, startline, deadline, state) values (?, ?, ?, ?, ?, ?)";
    con.query(sql, [id, title, discription, startline, deadline, state], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(true);
    });
});

app.post('/editIssue', (req, res) => {
    const id = req.query.id;
    const title = req.query.title;
    const discription = req.query.discription;
    const deadline = req.query.deadline;
    const state = req.query.state;
    const sql = "update issues set title = ?, discription = ?, deadline = ?, state = ? where id = ?";
    con.query(sql, [title, discription, deadline, state, id], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(true);
    });
});

app.post('/deleteIssue', (req, res) => {
    const id = req.query.id;
    const sql = "delete from issues where id = ?";
    con.query(sql, [id], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(true);
    });
});

app.post('/issueList', (req, res) => {
    const id = req.query.id;
    const sql = "select * from issues where id = ?";
    con.query(sql, [id], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(rows);
    });
});
