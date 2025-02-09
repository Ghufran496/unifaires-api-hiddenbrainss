const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USERNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  secure: true,
});

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  resource_type: "auto",
};

function removeLocalFile(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

const fileUpload = async (path) => {
  const result = await cloudinary.uploader.upload(path, options);

  if (result) {
    removeLocalFile(path);
    return result;
  }

  return false;
};

const fetchFiles = async (path) => {
  const result = await cloudinary.api.resources({ resource_type: "video" });

  if (result) {
    removeLocalFile(path);
    return result;
  }

  return false;
};

module.exports = {
  fileUpload,
  removeLocalFile,
  fetchFiles,
};
