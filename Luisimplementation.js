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
        if (session.userData.name) {

            next()
        } else {
            session.beginDialog('/profile')
        }
    },
    (session, args, next) => {
        const name = args.response

        session.send(`Hello, ${session.userData.name}!`)
        next()
    },
    (session, args, next) => {
        if(session.message.text == 'forget me'){
            session.userData.name = null;
            session.send('Forgotten');
        }
        next();
    }
])

bot.dialog('/profile' , [
     (session, args, next) => {
        builder.Prompts.text(session, "Hello user, what's your name?")
    },
    (session, args, next) => {
        if (session.message.text == 'Luis') {
            session.userData.a = false;
            session.beginDialog('/Luis')
        } else {
            next()
        }

    },
    (session, args, next) => {
        session.userData.name = session.message.text

        session.endDialog()
    }
])

bot.dialog('/Luis', [
(session,args,next) => {
    if(session.userData.a == false){
        builder.Prompts.text(session, "Please enter a location related question!");
    }
    else{
        args.response = session.message.text;
        next();
    }
},
(session, args, next) => {
    console.log(session.userData);
    var url = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/57c729f8-98e8-44e1-b71b-c86a959b35f2?subscription-key=7cc19b2909d54dc48f0357eb6ffbc7bf&verbose=true&timezoneOffset=0&q=';
    console.log('Going to Luis now');
    var http = require('https');
    session.userData.a == true;
    http.get(url+args.response, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            var Luisresponse = JSON.parse(body);
            console.log("Got a response: ", Luisresponse.intents[0]);
            session.send(Luisresponse.intents[0].intent);
        });
    }).on('error', function(e){
          console.log("Got an error: ", e);
    });
}


])