var express = require("express");
var bodyParser = require('body-parser');
const mysql = require('mysql');

var router = express.Router();
var jsonParser = bodyParser.json();

const connection = mysql.createConnection({
    host     : 'sql12.freesqldatabase.com',
    user     : 'sql12369407',
    password : 'xFMsEs2FlG',
    database : 'sql12369407'
});

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

router.post('/register',jsonParser, (req, res) => {
    connection.query("SELECT id FROM accounts WHERE email='"+req.body.email+"'"
    , function (error, results, fields) {
        if (error) 
            throw error;
        if(results.length)
        {
            res.send({msg: 'Account already exist.'});
            return;
        }
        else
        {
            connection.query("INSERT INTO accounts(f_name, l_name, email, password) VALUES ('"+ req.body.fname +"', '"+ req.body.lname +"', '"+ req.body.email +"', '"+ req.body.pass +"')"
            , function (error, results, fields) {
                if (error) 
                    throw error;
                res.send({msg: 'OK', id: results.insertId});
            });
        }
    });
});

router.post('/login',jsonParser, (req, res) => {
    connection.query("SELECT id, password FROM accounts WHERE email='"+req.body.email+"'"
    , function (error, results, fields) {
        if (error) 
            throw error;
        if(results.length && results[0].password == req.body.password)
            res.send({msg: 'OK', id: results[0].id});
        else
            res.send({msg: 'Email or Password is incorrect'});
    });
});

router.post('/getAccountData',jsonParser, (req, res) => {
    connection.query("SELECT f_name, l_name, permission FROM accounts WHERE id='"+req.body.id+"'"
    , function (error, results, fields) {
        if (error) 
            throw error;
        if(results.length)
            res.send({fname: results[0].f_name, lname: results[0].l_name, perm: results[0].permission});
    });
});

router.post('/addSearchHistory',jsonParser, (req, res) => {
    connection.query("INSERT INTO search_history(account_id, search_p) VALUES ('"+ req.body.id +"', '"+ req.body.input +"')"
    , function (error, results, fields) {
        if (error) 
            throw error;
    });
});

router.post('/getSearchHistory',jsonParser, (req, res) => {
    connection.query("SELECT search_p FROM search_history WHERE account_id='"+req.body.id+"' ORDER BY sid DESC"
    , function (error, results, fields) {
        if (error) 
            throw error;
        res.send(results);
    });
});

router.post('/addViewedHistory',jsonParser, (req, res) => {
    connection.query("INSERT INTO viewed_history(account_id, video_id, imageURL, Title) VALUES ('"+ req.body.id +"', '"+ req.body.vid +"', '"+ req.body.url +"', '"+ req.body.title +"')"
    , function (error, results, fields) {
        if (error) 
            throw error;
    });
});

router.post('/getViewedHistory',jsonParser, (req, res) => {
    connection.query("SELECT video_id, imageURL, Title FROM viewed_history WHERE account_id='"+req.body.id+"' ORDER BY vid DESC"
    , function (error, results, fields) {
        if (error) 
            throw error;
        res.send(results);
    });
});

router.post('/getAccounts',jsonParser, (req, res) => {
    connection.query("SELECT * FROM accounts"
    , function (error, results, fields) {
        if (error) 
            throw error;
        res.send(results);
    });
});

router.post('/getSearchHistoryTable',jsonParser, (req, res) => {
    connection.query("SELECT * FROM search_history"
    , function (error, results, fields) {
        if (error) 
            throw error;
        res.send(results);
    });
});

router.post('/getViewedHistoryTable',jsonParser, (req, res) => {
    connection.query("SELECT * FROM viewed_history"
    , function (error, results, fields) {
        if (error) 
            throw error;
        res.send(results);
    });
});

module.exports = router;