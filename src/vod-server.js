import dotenv from 'dotenv'
dotenv.config()

import tencentcloud from 'tencentcloud-sdk-nodejs'
import express from 'express'
import bodyParser from 'body-parser'

const VodClient = tencentcloud.vod.v20180717.Client
const models = tencentcloud.vod.v20180717.Models

const Credential = tencentcloud.common.Credential
const ClientProfile = tencentcloud.common.ClientProfile
const HttpProfile = tencentcloud.common.HttpProfile

const secretId = process.env.SECRET_ID
const secretKey = process.env.SECRET_KEY
const tcRegion = process.env.REGION
const tcBucket = process.env.COS_BUCKET

let cred = new Credential(secretId, secretKey)

let httpProfile = new HttpProfile()
httpProfile.reqMethod = 'POST'
httpProfile.reqTimeout = 30
httpProfile.endpoint = `vod.${tcRegion}.tencentcloudapi.com`

let clientProfile = new ClientProfile()
clientProfile.signMethod = 'HmacSHA256'
clientProfile.httpProfile = httpProfile

let client = new VodClient(cred, tcRegion, clientProfile)

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/process', (req, res) => {
  const { url } = req.query

  const id = url.split('/').pop()

  let aiRecognitionTask = new models.AiRecognitionTaskInput()
  aiRecognitionTask.Definition = 20

  let aiAnalysisTask = new models.AiAnalysisTaskInput()
  aiAnalysisTask.Definition = 20

  let mediaInp = new models.MediaInputInfo()
  mediaInp.Url = url
  mediaInp.Name = id
  mediaInp.Id = id

  let mediaOpt = new models.MediaOutputInfo()
  mediaOpt.Region = tcRegion
  mediaOpt.Bucket = tcBucket
  mediaOpt.Dir = '/output/'

  let mediaReq = new models.ProcessMediaByUrlRequest()

  mediaReq.InputInfo = mediaInp
  mediaReq.OutputInfo = mediaOpt
  mediaReq.AiRecognitionTask = aiRecognitionTask
  mediaReq.AiAnalysisTask = aiAnalysisTask

  client.ProcessMediaByUrl(mediaReq, function(mediaErr, mediaRes) {
    res.send(mediaErr || mediaRes)
  })
})

app.get('/query', (req, res) => {
  const { task } = req.query

  let taskReq = new models.DescribeTaskDetailRequest()
  taskReq.TaskId = task

  client.DescribeTaskDetail(taskReq, function(taskErr, taskRes) {
    res.send(taskErr || taskRes)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
