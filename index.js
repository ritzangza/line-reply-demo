const https = require('https');
const express = require('express')
const axios = require('axios');
const app = express()
const port = process.env.PORT || 4000
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

app.use(express.urlencoded({ extended: true })) // for form data
app.use(express.json()) // for json

app.use(function(req, res, next) {
    const allowedOrigins = ["*", "localhost"];
    const origin = req.get('origin');
    if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
    next();
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer pRXvHVgRRj+oWn+n+y8fAuDABD3HZ6WULfQCaN/OWR8R+AEEs5J2gIPzluBVyprvG2WNVKTSy7ZdzBV/eHzg6fp7fQRfQz0Bl49979xlZ9pTIe0mH0A4BLHBkQtcunMNw7gnq8aO3V/cSIG5gs4wTAdB04t89/1O/w1cDnyilFU=`
};

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/api/getDetails', async function(req, res) {
    let host = `${LINE_MESSAGING_API}`;
    console.log("req", req.body);
    console.log("host", host);
    let token = req.body.events[0].replyToken;
    console.log("token", token);
    let message = req.body.events[0].message;
    console.log("message", message);
    let source = req.body.events[0].source;
    console.log("source", source);
    let msg_data = { 
        replyToken: token, 
        messages: 
        [{  type: 'text',  text: 'Message ' + message.text + '\n' + 'userId: ' + source.userId}]
    }
    let configs = {
        method: 'post',
        url: `${host}/reply`,
        headers: LINE_HEADER,
        data: msg_data,
        timeout: 60000
    };
    axios(configs)
    .then(async function (responseUpdate) {
        // console.log(responseUpdate);
        let resUpdate = responseUpdate
        if(responseUpdate.status===200){
            console.log("dd", "");
        }else{
            ret = {
                "status": "500",
                "message": "Assignment Unavailable"
            }
            console.log("res", JSON.stringify(ret));
            return res.json(ret)
        }
    })
    .catch(function (error) {
        console.log(error);
        ret = {
        "status": "401",
        "message": "Request failed"
        }
        console.log("res", JSON.stringify(ret));
        return res.json(ret)
    });
})

app.post('/webhook', (req, res) => {
    res.sendStatus(200)
})

// var server = https.createServer( https_options , app );
// server.listen(port, function () { console.log('Starting node.js on port ' + port);});

function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
  }
  
  function clientErrorHandler (err, req, res, next) {
    console.log("clientErrorHandler", err);
    if (req.xhr) {
      ret = {
        "status": "500",
        "message": "Something went wrong!"
      }
      console.log("clientErrorHandler", JSON.stringify(ret));
      return res.status(500).json(ret);
    } else {
      next(err)
    }
  }
  
  function errorHandler (err, req, res, next) {
    console.log("errorHandler", err);
    ret = {
      "status": "500",
      "message": "Unexpected Error"
    }
    console.log("res", JSON.stringify(ret));
    return res.status(500).json(ret);
  }