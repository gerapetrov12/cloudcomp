const express = require('express');
const Minio = require('minio');
const fs = require('fs');
const http = require('http');
const bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');
var nodemailer = require('nodemailer');

const minioClient = new Minio.Client({
    endPoint: '10.15.16.45',
    port: 9000,
    useSSL: false,
    accessKey: 'ADMIN',
    secretKey: 'NIMDA12345'
});

const file = fs.createWriteStream("file.jpg");
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.post('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    // res.end(JSON.stringify(req.body.url));

    http.get(req.body.url, function (response) {
        response.pipe(file);
        minioClient.makeBucket('cars', function (err) {
            if (err) return console.log(err);

            console.log('Bucket created successfully');

            //Using fPutObject API upload your file to the bucket europetrip.
            minioClient.fPutObject('cars', 'my-cars.jpg', "file.jpg", function (err, etag) {
                if (err) return console.log(err);
                console.log('File uploaded successfully.')
            })
        });

        amqp.connect('amqp://10.15.16.45:8080', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var queue = 'my-queue';
                var data = {
                    "email": req.body.email,
                    "fileName": "file.jpg"
                };
                var msg = JSON.stringify(data);
                channel.assertQueue(queue, {durable: true});
                channel.sendToQueue(queue, Buffer.from(msg));
                console.log(" [x] Sent%s", msg);
            });

            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var queue = 'my-queue';
                channel.assertQueue(queue, {durable: true});
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
                channel.consume(queue, function (msg) {
                    console.log(" [x] Received %s", msg.content.toString());
                    var json_data = JSON.parse(msg.content);
                    console.log("name is " + json_data.fileName);
                    var mailOptions = {
                        host: 'mail.inbox.lv',
                        port: 465,
                        secure: true, // use SSL
                        auth: {
                            user: 'naruto2281488420@inbox.lv',
                            pass: 'D8S5jh4NRp'
                        }};

                    var message = {
                        from: 'naruto2281488420@inbox.lv',
                        to: 'gerapetrov@inbox.lv',
                        subject: 'Ave Maria',
                        text: json_data.fileName + " " + json_data.email,
                        html: '<p>Please...</p>'
                    };

                    var mailer228 = nodemailer.createTransport(mailOptions);

                    mailer228.sendMail(message, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                    });
                }, {noAck: true});
            });
        });
    });

    // amqp.connect('amqp://10.15.16.42:8080', function (error0, connection) {
    //     if (error0) {
    //         throw error0;
    //     }
    //     connection.createChannel(function (error1, channel) {
    //         if (error1) {
    //             throw error1;
    //         }
    //         var queue = 'my-queue';
    //         channel.assertQueue(queue, {durable: true});
    //         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    //         channel.consume(queue, function (msg) {
    //             console.log(" [x] Received %s", msg.content.toString());
    //             var json_data = JSON.parse(msg.content);
    //             console.log("name is " + json_data.name);
    //         }, {noAck: true});
    //     });
    // });

});


app.listen(port, () => console.log(`App listening on port ${port}!`));