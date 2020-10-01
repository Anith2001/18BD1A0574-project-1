var express=require("express");
var app=express();
let server=require('./server');
let middleware=require('./middleware');
const bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospital';
let db;
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName)
    console.log(`Connected to database:${url}`);
    console.log(`Database : ${dbName}`);
});
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Fetching details form hospital collection");
    db.collection('hospitalinfo').find().toArray(function(err,result){
        if(err) console.log(err);
        res.json(result);
    })
});

app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Fetching details form ventilator collection");
    db.collection('ventilatorInfo').find().toArray(function(err,result){
        if(err) console.log(err);
        res.json(result);
    })
});

app.post('/searchvent',middleware.checkToken,function(req,res){
    console.log("search ventilator by status and status and hospital")
    var name=req.body.name;
    var status=req.body.status;
    var query={"name":name,"status":status};
    console.log(name +" " + status);
    db.collection('ventilatorInfo').find(query).toArray(function(err,result){
        if(err) console.log("No match found");
        res.json(result);
    })
});

app.post('/searchos',middleware.checkToken,function(req,res){
    console.log("search hospital by name");
    var name=req.body.name;
    var query={"name":name};
    console.log(name);
    db.collection('hospitalinfo').find(query).toArray(function(err,result){
        if(err) console.log("No match found");
        res.json(result);
    })
});

app.post('/updateventdetails',middleware.checkToken,function(req,res){
    console.log("Update ventilator details");
    var vid=req.body.vid;
    var status=req.body.status;
    console.log(vid+" "+status);
    var query1={"vid":vid};
    var query2={$set:{"status":status}};
    db.collection('ventilatorInfo').update(query1,query2,function(err,result){
        if(err) console.log("update NOT successful");
        //console.log("updated successfully");
        res.json("1 document updated");
        res.json(result);
    });
});

app.put('/addventilator',middleware.checkToken,function(req,res){
    console.log("Adding a ventilator to the ventilatorInfo");
    var hid=req.body.hid;
    var vid=req.body.vid;
    var status=req.body.status;
    var name=req.body.name;
    console.log(hid+" "+vid+" "+status+" "+name);
    var query={"hid":hid,"vid":vid,"status":status,"name":name};
    db.collection('ventilatorInfo').insertOne(query,function(err,resut){
        if(err) console.log("record not inserted");
        res.json("ventilator added");
    });
});

app.delete('/deleteventilator',middleware.checkToken,function(req,res){
    console.log("deleting a ventilator by Vid");
    var vid=req.body.vid;
    console.log(vid);
    var q1={"vid":vid};
    db.collection('ventilatorInfo').deleteOne(q1,function(err,result){
        if(err) console.log("error in deleting the document");
        res.json("ventilator deleted");
    });
});
app.listen(3001);