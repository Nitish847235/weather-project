const express = require("express");
const request = require("requests");
const fs = require("fs");
const app = express();

const port = process.env.PORT || 8000;
const indexFile = fs.readFileSync("index.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  
    return temperature;
  };


app.get("/", (req,res)=>{

    request(
        `https://api.openweathermap.org/data/2.5/weather?q=haridwar&appid=5241a408ca9c7b51ddcee650c2d1856e`
    )
        .on("data", (chunk)=> {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // const temp = arrData[0].main.temp - 273.15;
            const realTimeData = arrData.map((val) => replaceVal(indexFile, val)).join("");
            res.write(realTimeData);
        })
        .on("end", (err)=>{
            if(err) return console.log(err);
            // console.log("end");
        });
    
})

app.listen(port, ()=>{
    console.log(`listen at ${port}`);
})
