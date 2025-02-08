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

const uploadProfileImage = multer({ storage, fileFilter }).single(
  'profileImage',
)

const uploadBookFiles = multer({ storage, fileFilter }).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 },
])

const uploadCoverImage = multer({ storage, fileFilter }).single('coverImage')

export { uploadProfileImage, uploadBookFiles, uploadCoverImage }
