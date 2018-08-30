

var amqp = require('amqp');
//
// var connection = amqp.createConnection({ host: '10.40.253.187' });
//
// // add this for better debuging
// connection.on('error', function(e) {
//   console.log("Error from amqp: ", e);
// });
//
// // Wait for connection to become established.
// connection.on('ready', function () {
//   console.log("aa")
//   // Use the default 'amq.topic' exchange
//   connection.queue('my-queue', function (q) {
//     // Catch all messages
//     q.bind('#');
//
//     // Receive messages
//     q.subscribe(function (message) {
//       // Print messages to stdout
//       console.log(message);
//     });
//   });
// });

// var connection = amqp.createConnection({url: "amqp://admin:admin@127.0.0.1:5672"});
var connection = amqp.createConnection({ host: '10.40.253.187' });
connection.on('ready', function () {
  var callbackCalled = false;
  exchange = connection.exchange('exchange_name', {type: 'direct',autoDelete:false});
  connection.queue("queue_name",{autoDelete:false}, function(queue){
    queue.bind('exchange_name','queue_name', function() {
      // exchange.publish(JSON.stringify({a:1,b:2}));
      // exchange.publish('queue_name', 'this is message is testing ......');
      // console.log(JSON.stringify({a:1,b:2}))
      // exchange.publish('queue_name',{a:1,b:2});
    //   exchange.publish('queue_name',JSON.stringify({a:1,b:2,dt:new Date()}));
    //   callbackCalled = true;
    //
    //   setTimeout(function() {
    //     console.log("Single queue bind callback succeeded");
    //     //exchange.destroy();
    //     //queue.destroy();
    //     connection.end();
    //     connection.destroy();
    //   }, 5000);
    //
    });

    queue.subscribe(function (message) {
      // console.log('At 5 second recieved message is:'+ message.data);
      console.log('At 5 second recieved message is:'+ message.data);
      // console.log('At 5 second recieved message is:',JSON.stringify(message));
    });

  });
});
