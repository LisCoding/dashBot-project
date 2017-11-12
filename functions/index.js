const { DialogflowApp } = require('actions-on-google')
const functions = require('firebase-functions')
const { sprintf } = require('sprintf-js')


const strings = require('./strings')

const config = require('./node_modules/env.json')


const Actions = {
  TELL_FACEBOOK: 'tell.facebook',
  TELL_SLACK: 'tell.slack',
  TELL_DIALOG : 'tell.dialog'
  
}

const Contexts = {
  FACEBOOK: 'choose_facebook-followup',
  //Intent Contexts ouput => manage the flow of the conversantion
  SLACK: 'choose_slack-followup'
}

const Parameters = {
  PLATFORM: 'platform'
}

const Lifespans = {
  DEFAULT: 60,
  END: 0
}

process.env.DEBUG = 'actions-on-google:*'

const initData = app => {
  const data = app.data
  if (!data.facts) {
    data.facts = {
      content: {}
    }
  }
  console.log('data in initData is ', data)
  return data
}

const tellFacebook = (app) => {
  const data = initData(app)
  console.log("This is app", app)
  console.log(data)

  const parameter = Parameters.PLATFORM
  const platformCategory = app.getArgument(parameter)
  console.log('params is', platformCategory)
  if(platformCategory === "key concepts"){
    app.ask(strings.slackDoc[0].steps[0])
  } else if (platformCategory === "facebook") {
      app.ask(strings.facebookDoc[0].steps[0])
      console.log("testing ", strings.dialogValues["intents"])
  } else {
    console.log("Are u here????")
    app.ask(strings.dialogValues[platformCategory])
  }
  // const msg = 'HELLO WORLD FROM TELLFACEBOOK'
}






const actionMap = new Map()
actionMap.set(Actions.TELL_FACEBOOK, tellFacebook);
// actionMap.set(Actions.TELL_SLACK, tellSlack);



const documentationDashbot
 = functions.https.onRequest((request, response) => {
   const app = new DialogflowApp({ request, response })
   console.log('APP IS ', app)
   console.log(`Request headers: ${JSON.stringify(request.headers)}`)
   console.log(`Request body: ${JSON.stringify(request.body)}`)
   app.handleRequest(actionMap)
 })

module.exports = {
  documentationDashbot
}
