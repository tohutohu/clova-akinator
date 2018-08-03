const Akinator = require('./akinator.js');
const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');

const clovaSkillHandler = clova.Client
  .configureSkill()
  .onLaunchRequest(async responseHelper => {
    const {params, question} = await Akinator.start()
    responseHelper.responseObject.sessionAttributes = params

    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: '誰か一人を思い浮かべて次の質問に「はい」か「いいえ」で答えてください。' + question.question,
    });
  })
  .onIntentRequest(async responseHelper => {
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();
    const params = responseHelper.responseObject.sessionAttributes
    console.log(params)
    let answer = 0

    switch (intent) {
      case 'Yes':
      case 'Clova.YesIntent':
        console.log('Yes')
        answer = 0
        break;
      case 'No':
      case 'Clova.NoIntent':
        console.log('No')
        answer = 1
        break;
      default:
        console.log('Other')
        break
    }
    const question = await Akinator.answer(params, answer)
    console.log(question)
    responseHelper.responseObject.sessionAttributes.step++
    if (Number(question.progression) > 99) {
      const answer = await Akinator.list(params)
      responseHelper.setSimpleSpeech(
        clova.SpeechBuilder.createSpeechText('わかりました！あなたが思い浮かべているのは' + answer.name + 'ですね！')
      );
      responseHelper.responseObject.response.shouldEndSession = true
      return
    }
    responseHelper.setSimpleSpeech(
      clova.SpeechBuilder.createSpeechText(question.question)
    );
  })
  .onSessionEndedRequest(responseHelper => {
    const sessionId = responseHelper.getSessionId();

    // Do something on session end
  })
  .handle();

const app = new express();
const clovaMiddleware = clova.Middleware({ applicationId: "com.to-hutohu.akinator" });
// Use `clovaMiddleware` if you want to verify signature and applicationId.
// Please note `applicationId` is required when using this middleware.
app.post('/', clovaMiddleware, clovaSkillHandler);

app.get('/ping', (req, res) => {
  console.log(req)
  res.send('pong')
})

app.get('*', (req, res) => {
  res.send(req.originalUrl)
})

app.post('*', (req, res) => {
  res.send(req.originalUrl)
})

app.listen(8080);

