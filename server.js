const Akinator = require('./akinator.js');

let session, signature, step;

const clova = require('@line/clova-cek-sdk-nodejs');
const express = require('express');

const clovaSkillHandler = clova.Client
  .configureSkill()
  .onLaunchRequest(async responseHelper => {
    console.log(responseHelper)
    const {params, question} = await Akinator.start()
    responseObject.sessionAttributes = params
    responseObject.sessionAttributes.step++

    responseHelper.setSimpleSpeech({
      lang: 'ja',
      type: 'PlainText',
      value: '誰か一人を思い浮かべて次の質問に「はい」か「いいえ」で答えてください。' + question.question,
    });
  })
  .onIntentRequest(async responseHelper => {
    console.log(responseHelper)
    const intent = responseHelper.getIntentName();
    const sessionId = responseHelper.getSessionId();
    const params = responseObject.sessionAttributes
    let answer = 0

    switch (intent) {
      case 'Clova.YesIntent':
        answer = 0
        break;
      case 'Clova.NoIntent':
        answer = 1
        break;
    }
    const question = await Akinator.answer(params, answer)
    responseObject.sessionAttributes.step++
    if (Number(question.progression) > 99) {
      const answer = await Akinator.list(params)
      responseHelper.setSimpleSpeech(
        clova.SpeechBuilder.createSpeechText('わかりました！あなたが思い浮かべているのは' + answer.name + 'ですね！')
      );
      responseHelper.responseObject.shouldEndSession = true
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


const main = async () => {
  const client = new Akinator()
  const po = await client.start()
  console.log(po)
  console.log(client)

  while(true) {
    const res = await client.answer(0)
    console.log(res)
    if (Number(res.parameters.progression) > 99) {
      break
    }
  }
  const res = await client.list()
  console.log(JSON.stringify(res, null, '  '))
}
main()
