const { errorHandler } = require("./helpers");

function getLargestImageId(images) {
  try {
    const imageMetadataArr = [];
    // recursively getting all ids and size, independable of object structure
    const extractMetadata = (items) => {
      const metadata = {
        file_id: null,
        file_size: null,
      };
      // iterate through prop names
      for (const prop in items) {
        const val = items[prop]; // get value of prop
        if (prop === "file_id" || prop === "file_size") {
          metadata[prop] = val;
        } else if (val instanceof Object) {
          extractMetadata(val);
        }
      }
      // iterated through all props
      if (metadata.file_id !== null && metadata.file_size !== null) {
        // check if file id and size exist, push to main arr
        imageMetadataArr.push(metadata);
      }
    };

    extractMetadata(images);
    // Getting id of the image with largest size
    let largestImageSize = 0;
    let largestImageId = "";

    for (const metadata of imageMetadataArr) {
      const { file_size: imageSize, file_id: imageId } = metadata;
      if (imageSize === null || imageId == null) {
        throw TypeError("Invalid image metadata, missing values");
      } else if (imageSize > largestImageSize) {
        largestImageSize = imageSize;
        largestImageId = imageId;
      }
    }
    return largestImageId;
  } catch (error) {
    errorHandler(error, "getLargestImageId");
    return "";
  }
}

module.exports = { getLargestImageId };
