const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "doavqstpu",
  api_key: "694563958266697",
  api_secret: "xnvUfWWqBms9bZRiIIIMmkKJDWI",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "room-rental",
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
    resource_type: "image",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
