require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require("https");

const app = express();
app.use(cors());
app.use(express.json());

const mailerApiKey = process.env.mailer_api_key
const mailerBaseUrl = process.env.mailer_base_url
app.get('/api/mailers/campaigns', async(req, res) => {
    var chunks = [];
    var options = {
        "method": "GET",
        "hostname": mailerBaseUrl,
        "path": "/api/v2/campaigns?limit=100",
        "headers": {
            "x-mailerlite-apikey": mailerApiKey
        }
    };

    var req = await http.request(options, function (resp) {
        resp.on("data", function (chunk) {
            chunks.push(chunk);
        });

        resp.on("end", function () {
            var body = Buffer.concat(chunks);
            res.send(JSON.parse(body))
        });
    });
    req.end();
});

app.post('/api/mailers/subscriber', async(req, res) =>{
    // console.log(req.body)
    await postReq(`https://${mailerBaseUrl}/api/v2/groups/77283926/subscribers`, req.body)
    res.send()
});

const postReq = async(url, data) => {
    try{
        console.log('data', data)
    const dataString = JSON.stringify(data)
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length,
        'x-mailerlite-apikey': mailerApiKey
      },
      timeout: 5000, // in ms
    }
  
    return new Promise((resolve, reject) => {
      const req = http.request(url, options, (res) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          return reject(new Error(`HTTP status code ${res.statusCode}`))
        }
  
        const body = []
        res.on('data', (chunk) => body.push(chunk))
        res.on('end', () => {
          const resString = Buffer.concat(body).toString()
          resolve(resString)
        })
      })
  
      req.on('error', (err) => {
        reject(err)
      })
  
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request time out'))
      })
  
      req.write(dataString)
      req.end()
    })
    }catch(err){
        console.log(err)
    }
  }

require('./prod')(app);
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
});