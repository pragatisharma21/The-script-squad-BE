import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|pdf/
  const isFileTypeValid = allowedTypes.test(file.mimetype)

  if (isFileTypeValid) {
    cb(null, true)
  } else {
    cb(
      new Error('Invalid file type. Only JPG, JPEG, PNG, and PDF are allowed.'),
      false,
    )
  }
}

const upload = multer({ storage, fileFilter })

export default upload
