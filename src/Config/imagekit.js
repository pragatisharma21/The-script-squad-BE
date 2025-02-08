import ImageKit from 'imagekit'
import dotenv from 'dotenv'

dotenv.config()

const imagekitSetup = new ImageKit({
  publicKey: process.env.IMAGEKIT_API,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.IMAGKIT_URLENDPOINT,
})

export default imagekitSetup
