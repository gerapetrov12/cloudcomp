var amqp = require('amqplib/callback_api');

amqp.connect('amqp://10.15.16.45:8080', function (error0, connection) {
    if (error0) {
        throwerror0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throwerror1;
        }
        var queue = 'my-queue';
        // var data = {"name": "janis", "phone": 1234};
        // var msg = JSON.stringify(data);
        channel.assertQueue(queue, {durable: true});
        channel.sendToQueue(queue, Buffer.from(msg));
        channel.consume(queue, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
            varjson_data = JSON.parse(msg.content);
            console.log("name is " + json_data.name);
        }, {noAck: true});
        console.log(" [x] Sent%s", msg);
    });
});