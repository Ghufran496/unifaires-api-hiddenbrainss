const { useAsync } = require("../core");
const { JParser } = require("../core/core.utils");
const { fileUpload, fetchFiles } = require("../helpers/uploads");

const fileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.rar",
  "application/zip",
  "application/x-tar",
  "application/x-7z-compressed",
  "application/octet-stream",
];

exports.store = useAsync(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json(JParser("No file selected", false, null));
    }

    const { mimetype, path } = req.file;

    if (!fileTypes.includes(mimetype)) {
      return res.status(400).json(JParser("Invalid media file", false, null));
    }

    // Call upload image helper
    const upload = await fileUpload(path);

    const data = {
      public_id: upload.public_id,
      url: upload.secure_url,
    };

    return res.status(201).json(JParser("ok-response", true, data));
  } catch (error) {
    console.log("Error in media upload: ",error);
    next(error);
  }
});

exports.index = useAsync(async (req, res) => {
  try {
    const files = await fetchFiles();

    res.send(files).status(200);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(JParser("Something went wrong", false, error.message));
  }
});
