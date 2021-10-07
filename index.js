const bot = require("robotjs");
const { fishingPos, runCount, targetHex, compareTime } = require("./variables");
const { screenCapture, sleep } = require("./utils");

let totalFound = 0;

const findGreenPixelUsingCapture = (x, y) => {
  const fishingBtnBitmap = screenCapture(x, y, false);
  const currentHex = fishingBtnBitmap.colorAt(2, 2);
  const isFound = targetHex.includes(currentHex);
  if (isFound) {
    console.log("Found: ", currentHex);
  }
  return isFound;
};

const findGreenPixel = (x, y) => {
  for (let i = 0; i < 3; i++) {
    const increment = 2 * i;
    const currX = x + increment;
    const currY = y + increment;
    const currentHex = bot.getPixelColor(currX, currY);
    const isFound = targetHex.includes(currentHex);
    if (isFound) {
      console.log("Found: ", currentHex);
      return isFound;
    }
  }
};

const main = () => {
  let count = 0;
  while (count < runCount) {
    sleep(2000);
    bot.moveMouse(fishingPos[0], fishingPos[1]);
    bot.mouseClick();
    bot.moveMouse(fishingPos[0] - 50, fishingPos[1] - 50);
    const start = new Date();
    while (true) {
      const isFound = findGreenPixel(fishingPos[0], fishingPos[1]);
      if (isFound) {
        bot.moveMouse(fishingPos[0] + 20, fishingPos[1] + 20);
        bot.mouseClick();
        totalFound++;
        break;
      } else {
        const now = new Date();
        const margin = (now - start) / 1000;
        if (margin > compareTime) {
          break;
        }
      }
    }
    sleep(2000);
    count++;
  }
};

// Init function
(() => {
  console.log("Rox fishing bot running...");
  // Make sure you already run `npm run target` first and copy the target hex to variables.js
  main();
  console.log(`Total Found: ${totalFound}`);
  console.log(`Accuracy: ${Math.round((totalFound / runCount) * 100)}%`);
})();
