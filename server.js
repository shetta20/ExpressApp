const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const knex = require('knex');
const pg = require('pg');
const cors = require('cors');

//Parse incoming body
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())


const postgres = knex({
        client: 'pg',
        connection: {
        host : '127.0.0.1',
        user : 'ashettyj',
        password : '',
        database : 'tickets'
      }
    });

//Get method on root
app.get('/', (req,res)=> {
res.send("Getting root");
})

//Get method on /users
app.get('/tickets', async function (req,res){
    console.log("Get Here")
    const myres = await postgres.select('*').from('tickets').orderBy('tno');
    res.send(myres);
})

app.get('/metadata', async function (req,res){
    console.log("Get Here")
    const myres = await postgres.select('tno','ttitle').from('tickets').orderBy('tno');
    res.send(myres);
})

app.get('/tickets/:id', async function (req,res){
    console.log("Get Here with id")
    const myres = await postgres.where('tno',req.params.id).from('tickets').orderBy('tno');
    myres.length?res.send(myres):res.send("No such ticket found")

})

//Post method on users
app.post('/tickets', (req,res)=> {
    console.log(req.body);
    postgres('tickets').insert(req.body).then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {});
    res.send('Done adding ticket');
});

//Delete user method
app.delete('/tickets/:id', (req,res)=>{
    console.log(req.params);
postgres("tickets").where("tno",req.params.id).del().then(function (count) {
  console.log(count);
}).finally(function () {
});
res.send('Done Deleting ticket');
})

//Listen to requests
app.listen(3001,() => {console.log("Server is listening")});
