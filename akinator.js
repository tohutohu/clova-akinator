const request = require('request-promise');

const start = async () => {
  const opts = {
    method: 'GET',
    json: true,
    url: `https://srv11.akinator.com:9172/ws/new_session?partner=1&player=website-desktop&constraint=ETAT<>%27AV%27`,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    },
    gzip: true
  }
  const res = await request(opts)

  const params = {}
  params.session = res.parameters.identification.session
  params.signature = res.parameters.identification.signature
  params.step = 0
  return {params, question: res.parameters.step_information}
}

const answer = async (params, answerID) => {
  const opts = {
    method: 'GET',
    json: true,
    url: `https://srv11.akinator.com:9172/ws/answer?callback=&session=${params.session}&signature=${params.signature}&step=${params.step}&answer=${answerID}`,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    },
    gzip: true
  }
  const res = await request(opts)
  return res.parameters
}

const list = async (params) =>  {
  const opts = {
    method: 'GET',
    json: true,
    url: `https://srv11.akinator.com:9172/ws/list?session=${params.session}&signature=${params.signature}&step=${params.step}`,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
    },
    gzip: true
  }
  const res = await request(opts)
  return res.parameters.elements[0].element
}

module.exports = {start, answer, list}

// module.exports = class Akinator{
//   constructor() {
//     this.opts = {
//       method: 'GET',
//       json: true,
//       headers: {
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
//         'Accept-Encoding': 'gzip, deflate',
//         'Accept-Language': 'en-US,en;q=0.9',
//         'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
//       },
//       gzip: true
//     }
//     this.session = 0
//     this.signature = 0
//     this.step = 0
//   }
// 
//   async start() {
//     this.opts.url = `https://srv11.akinator.com:9172/ws/new_session?partner=1&player=website-desktop&constraint=ETAT<>%27AV%27`
//     const res = await request(this.opts)
//     this.session = res.parameters.identification.session
//     this.signature = res.parameters.identification.signature
//     this.step = 0
//     return res
//   }
// 
//   async answer(answerID) {
//     this.opts.url = this.getURL(answerID)
//     const res = await request(this.opts)
//     this.step++
//     return res
//   }
// 
//   async list() {
//     this.opts.url = `https://srv11.akinator.com:9172/ws/list?session=${this.session}&signature=${this.signature}&step=${this.step}`
//     const res = await request(this.opts)
//     this.step++
//     return res
//   }
// 
//   getURL (answerID) {
//     return `https://srv11.akinator.com:9172/ws/answer?callback=&session=${this.session}&signature=${this.signature}&step=${this.step}&answer=${answerID}`
//   }
// }
