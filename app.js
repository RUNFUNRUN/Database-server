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
    const userId = req.query.userId;
    const password = req.query.password;
    const sql = "select exists(select * from users where userId = ? and password = ?) as check_user"
    con.query(sql, [userId, password], (err, rows, fields) => {
        if (err) throw err;
        if (rows[0].check_user == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

app.post('/create-account', (req, res) => {
    const userId = req.query.userId;
    const password = req.query.password;
    const checkSql = "select exists(select * from users where userId = ?) as check_user"
    const createSql = "insert into users (userId, password) values (?, ?)";
    con.query(checkSql, [userId, password], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows[0].check_user);
        if (rows[0].check_user == 1) {
            res.send(false);
        } else {
            con.query(createSql, [userId, password], (err, rows, fields) => {
                if (err) throw err;
                console.log(rows);
                res.send(true);
            });
        };
    });
});

app.post('/create-issue', (req, res) => {
    const userId = req.query.userId;
    const title = req.query.title;
    const description = req.query.description;
    const startline = req.query.startline;
    const deadline = req.query.deadline;
    const state = 0;
    const sql = "insert into issues (userId, title, description, startline, deadline, state) values (?, ?, ?, ?, ?, ?)";
    con.query(sql, [userId, title, description, startline, deadline, state], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(true);
    });
});

app.put('/edit-issue-state', (req, res) => {
    const userId = req.query.userId;
    const title = req.query.title;
    const state = req.query.state;
    const sql = "update issues set state = ? where userId = ? and title = ?";
    con.query(sql, [state, userId, title], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(true);
    });
});

app.delete('/delete-issue', (req, res) => {
    const userId = req.query.userId;
    const title = req.query.title;
    const sql = "delete from issues where userId = ? and title = ?";
    con.query(sql, [userId, title], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows);
        res.send(true);
    });
});

app.get('/issues-list', (req, res) => {
    const userId = req.query.userId;
    const sql = "select * from issues where userId = ?";
    con.query(sql, [userId], (err, rows, fields) => {
        if (err) throw err;
        console.log(userId);
        console.log(rows);
        res.send(rows);
    });
});
