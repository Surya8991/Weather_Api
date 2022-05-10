require('dotenv').config()
const express = require("express");
const bodyParser=require("body-parser");
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT||3000,function()
{
    console.log("server up and running at port 3000");
});

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res)
{
    const query=req.body.cityName;
    const appid=process.env.SECRET_KEY;
    const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    appid +
    "&units=metric"; //url to acces the api
    //to get the data from api using the url
    https.get(url,function(response)
    {
        console.log(response.statusCode);
        response.on("data",function(data){
        const weatherData=JSON.parse(data);
        const temp = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;
        const imageUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        const weatherDescription = weatherData.weather[0].description;
        res.write("<h1>The weather condition is " + weatherDescription + "</h1>");
        res.write("<h1>The temperature on " + query+" is "+temp + " degree celcius</h1>");
        res.write("<img src=" + imageUrl + ">");
        res.send();
        });
    });
});