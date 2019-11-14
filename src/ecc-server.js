import dotenv from 'dotenv'
dotenv.config()

import tencentcloud from 'tencentcloud-sdk-nodejs'

const EccClient = tencentcloud.ecc.v20181213.Client
const models = tencentcloud.ecc.v20181213.Models

const Credential = tencentcloud.common.Credential
const ClientProfile = tencentcloud.common.ClientProfile
const HttpProfile = tencentcloud.common.HttpProfile

let cred = new Credential(process.env.SECRET_ID, process.env.SECRET_KEY)

let httpProfile = new HttpProfile()
httpProfile.reqMethod = 'POST'
httpProfile.reqTimeout = 60
httpProfile.endpoint = 'ecc.ap-beijing.tencentcloudapi.com'

let clientProfile = new ClientProfile()

clientProfile.signMethod = 'HmacSHA256'
clientProfile.httpProfile = httpProfile

let client = new EccClient(cred, '', clientProfile)

let req = new models.ECCRequest()
req.Content = 'this composition content'

client.ECC(req, function(err, response) {
  if (err) {
    console.log(err)
    return
  }

  console.log(response.to_json_string())
})
