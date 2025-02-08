import ImageKit from 'imagekit'
import dotenv from 'dotenv'

dotenv.config()

const imagekitSetup = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.IMAGKIT_URLENDPOINT,
})

export default imagekitSetup
  