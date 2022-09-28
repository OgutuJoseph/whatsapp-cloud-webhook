const express = require('express');
const body_parser = require('body-parser');
const axios = require('axios');
const app = express().use(body_parser.json());
require('dotenv').config();

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

/** routes */
app.get('/', (req, res) => {
    res.sendStatus(201).send('Whatsapp Webhook - Cloud API')
});

// to verify the callback url from dashboard side - cloud api side
app.get('/webhook', (req, res) => {
    let mode = req.query['hub.mode'];
    let challenge = req.query['hub.challenge'];
    let token = req.query['hub.verify_token'];

    if(mode && token) {
        if(mode === 'subscribe' && token === mytoken){
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
})

app.post('/webhook', (req, res) => {
	let body_param = req.body;

	if(body_param.object){
		if(body_param.entry &&
			body_param.entry[0].changes &&
			body_param.entry[0].changes[0].value.messages &&
			body_param.entry[0].changes[0].value.messages[0]
		){
			let phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
			let from = body_param.entry[0].changes[0].value.messages[0].from;
			let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body

            axios({
                method: 'POST',
                url: 'https://graph.facebook.com/v13.0/'+phone_no_id+'/message?access_token='+token,
                data: {
                    messaging_product: 'whatsapp',
                    to: from,
                    text: {
                        body: 'Hi, thank your for reaching Hozef'
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            res.sendStatus(200);
		} else {
            res.sendStatus(404);
        }
	}
});

/** connect app */
const port = process.env.PORT;
// app.listen(8000 || port, () => {
//     // console.log(`Server connected on port: ${port}`)
//     console.log(`Server connected.`)
// })

/** for heroku deployment */
app.listen(port, () => {
    // console.log(`Server connected on port: ${port}`)
    console.log(`Server connected.`)
})