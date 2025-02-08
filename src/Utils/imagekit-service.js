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

    return { url: uploadedFile?.url, fileId: uploadedFile?.fileId }
  } catch (error) {
    console.error('Image Upload Error:', error)
    throw error
  }
}

const deleteFromImagekit = async (profileImage) => {
  try {
    if (
      !profileImage.url ||
      profileImage.url.includes(
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      ) 
    ) {
      console.log('Skipping deletion: Default profile image detected.')
      return false
    }

    const fileId = profileImage.fileId
    if (!fileId) {
      console.log('No fileId found for image deletion')
      return false
    }

    await imagekitSetup.deleteFile(fileId)
    return true
  } catch (error) {
    console.error('Image Deletion Error:', error)
    return false
  }
}

export { uploadToImagekit, deleteFromImagekit }
