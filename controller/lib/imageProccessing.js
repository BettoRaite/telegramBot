const { errorHandler } = require("./helpers");

async function getLargestImgId(items) {
  try {
    let largestSize = 0;
    let largestItemId = "";

    for (const item of items) {
      const itemSize = item.file_size;

      if (itemSize > largestSize) {
        largestSize = itemSize;
        largestItemId = item.file_id;
      }
    }
    return largestItemId;
  } catch (error) {
    errorHandler(error, "getLargestImgId");
  }
}

module.exports = { getLargestImgId };
