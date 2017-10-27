const builder = require('botbuilder')
const restify = require('restify')

// Create a bot
const connector = new builder.ChatConnector()
const bot = new builder.UniversalBot(connector)

// Setup a server
const server = restify.createServer()
server.listen(3978, () => {
    console.log('restify listening on port 3978')
})
server.post('/api/messages', connector.listen())

// Brains of bot
bot.dialog('/', [
    (session, args, next) => {
        session.send('Hello world! ')
    }
])