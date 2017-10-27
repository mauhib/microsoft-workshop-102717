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

// Create Dialogues
bot.dialog('/', [
    (session, args, next) => {
        console.log('called')
        if (session.userData.name) {
            console.log('hi');
            next()
        } else {
            console.log('bye');
            session.beginDialog('/profile')
        }
    },
    (session, args, next) => {
        const name = args.response

        session.send(`Hello, ${session.userData.name}!`)
    }
])

bot.dialog('/profile' , [
     (session, args, next) => {
        builder.Prompts.text(session, "Hello user, what's your name?")
    },
    (session, args, next) => {
        session.userData.name = args.response

        session.endDialog()
    }
])