import imagekitSetup from '../Config/imagekit.js'

const uploadToImagekit = async (file, fileType) => {
  try {
    if (!file) {
      throw new Error('No file provided')
    }

    let folder = '/uploads'
    if (fileType === 'profileImage') {
      folder = '/profile_images'
    } else if (fileType === 'bookPdf') {
      folder = '/book_pdfs'
    } else if (fileType === 'coverImage') {
      folder = '/book_cover_images'
    }

    const uploadedFile = await imagekitSetup.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: folder,
    })

    return uploadedFile.url
  } catch (error) {
    console.log(error.message)
  }
}

export default uploadToImagekit
