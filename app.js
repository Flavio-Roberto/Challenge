const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser=bodyParser.urlencoded({extended:false});
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    port:3306
});
sql.query("use feegow");
app.engine("handlebars", handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get('/:id?', function(req, res){
    // res.render('index', {now: new Date().toLocaleString()});
    if(!req.params.id){
        sql.query("select * from agendarprofissional", function(err, results, fields){
            res.render('index',{data:results , now: new Date().toLocaleString()});
        })
    }
})
// app.get('/script', function(req, res){
//     res.sendFile(__dirname+'/js/script.js');
// })
// app.get('/style', function(req, res){
//     res.sendFile(__dirname+'/css/style.css');
// })
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.post('/salvar',urlencodeParser,function(req,res){
    sql.query('insert into agendarprofissional values(?,?,?,?,?,?,?,?)', ["",req.body.specialty_id,req.body.profissional_id,req.body.nome,
    req.body.cpf,req.body.source_id,req.body.birthdate,req.body.date_time]);
    sql.query("select * from agendarprofissional", function(err, results, fields){
        res.render('index',{data:results , now: new Date().toLocaleString(),result: "adicionado"});
    })
})
app.get('/deletar/:id', function(req, res){
    sql.query("delete from agendarprofissional where agendarProfissional_id=?",[req.params.id]);
    sql.query("select * from agendarprofissional", function(err, results, fields){
        res.render('index',{data:results , now: new Date().toLocaleString(),result: "deletado"});
    })
})

app.post("/update/:id", urlencodeParser, function(req,res){
    sql.query("update agendarprofissional ap set ap.name=?,ap.source_id=?,ap.birthdate=?,ap.cpf=? where ap.agendarProfissional_id=?",
    [req.body.nome, req.body.source_id, req.body.birthdate, req.body.cpf, req.body.ap_id])
    sql.query("select * from agendarprofissional", function(err, results, fields){
        res.render('index',{data:results , now: new Date().toLocaleString(),result: "atualizado"});
    })
})

app.listen(3000, function(req, res){
    console.log('Servidor esta rodando')
})