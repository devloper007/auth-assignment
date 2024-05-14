import multer from "multer";

export const uploadProfilePicture = ()=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")
          cb(null, process.env.PROFILE_PATH)
          
        },
        filename: function (req, file, cb) {
          const uniquePref = Date.now()
          
          cb(null, uniquePref + '-'+file.originalname)
        }
      })
      
      const upload = multer({ storage: storage })
      return upload;
}