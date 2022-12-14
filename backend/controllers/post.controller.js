//importing database schema;
const {
    electronics,
} = require('../models/schema');

//importing file system;
const fs = require('fs');

//importing axios 
const axios = require('axios');

//post controllers;

//electronics post controller;

const postElectronicsController = (req, res, next) => {
    const electronicAdd = new electronics({
        image: {
            data: fs.readFileSync(req.file.filename),
            contentType: 'image/png'
        },
        description: req.body.description,
        price: req.body.price
    });
    electronicAdd.save((err) => {
        if (!err) {
            console.log({ electronicAdd });
        } else {
            console.log('electronic add error: ', err);
        }
    });
}

//stk post controller;
const postStkController = async(req, res) => {
    const shortCode = 174379;
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    //const url = "https: //sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"

    const date = new Date();
    const timestamp =
        date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
    const password = new Buffer.from(shortCode + passkey + timestamp).toString(
        "base64"
    );
    const data = {
        "BusinessShortCode": shortCode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": `254${phone}`,
        "PartyB": "174379",
        "PhoneNumber": `254${phone}`,
        "CallBackURL": "https://mydomain.com/pat",
        "AccountReference": "Test",
        "TransactionDesc": "Test"
    }

    await axios
        .post(url, data, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log(response.data.ResponseDescription);
            res.status(200).json(response.data.ResponseDescription);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err.message);
        });

}


//exporting controllers;
module.exports = {
    postElectronicsController,
    postStkController,
}