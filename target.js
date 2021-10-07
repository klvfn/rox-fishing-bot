const bot = require("robotjs");
const { sleep, screenCapture } = require("./utils");
const { fishingPos } = require("./variables");

const findTargetHex = (x, y, type = "pixel") => {
  sleep(2000);
  const targetHex = [];
  for (let i = 0; i < 5; i++) {
    const increment = 2 * i;
    const currX = x + increment;
    const currY = y + increment;
    const color =
      type === "capture"
        ? screenCapture(currX, currY, true, `target_hex_img_${i}.jpg`).colorAt(
            0,
            0
          )
        : bot.getPixelColor(currX, currY);
    targetHex.push(color);
  }
  console.log(targetHex);
};

console.log("Find target hex...");
// 1. Screenshot image when found fish (fishing rod with green around the circle image), currently only work on 1920x1080
// 2. Find target hex by running findTargetHex func and pass the x,y position
findTargetHex(fishingPos[0], fishingPos[1]);
