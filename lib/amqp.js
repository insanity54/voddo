const amqp = require('amqplib');
const debug = require('debug')('voddo');

module.exports = async function amqpFactory (url, exchange, routingKey) {
  debug(`ampq connecting to ${url}, exchange ${exchange}, using routingKey ${routingKey}`);

  let msg = 'Hai thurr';
  return amqp.connect(url).then(function(conn) {
    return conn.createChannel().then((ch) => {
      return ch.assertExchange(exchange, 'capture').then(() => {
        return channel.publish(exchange, routingKey, Buffer.from(msg))
      })
    })
  }).catch((e) => {
    console.error(`  [*] we got an amqp err but we caught it. Err:${e} `)
  })


}