import dotenv from 'dotenv'
dotenv.config()

import tencentcloud from 'tencentcloud-sdk-nodejs'

const VodClient = tencentcloud.vod.v20180717.Client
const models = tencentcloud.vod.v20180717.Models

const Credential = tencentcloud.common.Credential
const ClientProfile = tencentcloud.common.ClientProfile
const HttpProfile = tencentcloud.common.HttpProfile

const secretId = process.env.SECRET_ID
const secretKey = process.env.SECRET_KEY

let cred = new Credential(secretId, secretKey)

let httpProfile = new HttpProfile()
httpProfile.reqMethod = 'POST'
httpProfile.reqTimeout = 30
httpProfile.endpoint = 'vod.tencentcloudapi.com'

let clientProfile = new ClientProfile()
clientProfile.signMethod = 'HmacSHA256'
clientProfile.httpProfile = httpProfile

let task = new models.AiRecognitionTaskInput()
task.Definition = 10

let mediaInp = new models.MediaInputInfo()
mediaInp.Url = 'http://techslides.com/demos/sample-videos/small.mp4'
mediaInp.Name = 'spr'
mediaInp.Id = 'spr-video-id'

let mediaOpt = new models.MediaOutputInfo()
mediaOpt.Region = 'ap-bangkok'
mediaOpt.Bucket = 'spr-1254420689'
mediaOpt.Dir = '/output/'

let req = new models.ProcessMediaByUrlRequest()

req.InputInfo = mediaInp
req.OutputInfo = mediaOpt
req.AiRecognitionTask = task

let client = new VodClient(cred, '', clientProfile)

client.ProcessMediaByUrl(req, function(err, res) {
  console.log(err || res)
})

// let client = new EccClient(cred, 'ap-shanghai', clientProfile)

// let req = new models.EHOCRRequest()
// req.InputType = 1
// req.Image = process.env.IMAGE

// client.EHOCR(req, function(err, response) {
//   if (err) {
//     console.log(err)
//     return
//   }
//   console.log(response.to_json_string())
// })
