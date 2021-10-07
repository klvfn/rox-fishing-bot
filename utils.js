const path = require("path");
const sharp = require("sharp");
const bot = require("robotjs");
const { imageSize } = require("./variables");

const saveImageBuffer = async (bitmap, filename) => {
  const filepath = path.join(__dirname, "output", filename);
  const channels = 3;
  const {
    image,
    width: cWidth,
    height: cHeight,
    bytesPerPixel,
    byteWidth,
  } = bitmap;
  const uint8array = new Uint8Array(cWidth * cHeight * channels);
  for (let h = 0; h < cHeight; h += 1) {
    for (let w = 0; w < cWidth; w += 1) {
      let offset = (h * cWidth + w) * channels;
      let offset2 = byteWidth * h + w * bytesPerPixel;
      uint8array[offset] = image.readUInt8(offset2 + 2);
      uint8array[offset + 1] = image.readUInt8(offset2 + 1);
      uint8array[offset + 2] = image.readUInt8(offset2 + 0);
    }
  }
  await sharp(Buffer.from(uint8array), {
    raw: {
      width: cWidth,
      height: cHeight,
      channels,
    },
  }).toFile(filepath);

  console.log(`File saved to ${filepath}`);
};

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const screenCapture = (x, y, debug = false, filename) => {
  const fishingBtnBitmap = bot.screen.capture(x, y, imageSize, imageSize);
  const imageName = filename || "fishing_button.jpg";
  if (debug) {
    saveImageBuffer(fishingBtnBitmap, imageName);
  }
  return fishingBtnBitmap;
};

module.exports = {
  saveImageBuffer,
  sleep,
  screenCapture,
};
