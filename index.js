require("dotenv").config();
const bot = require("robotjs");

// Variables
const fishingPos = process.env.FISHING_POS.split(",").map((fp) => parseInt(fp));
const runCount = parseInt(process.env.RUN_COUNT);
const targetHex = process.env.TARGET_HEX.split(",");
const compareTime = parseInt(process.env.COMPARE_TIME);

let totalFound = 0;

const findTargetHex = (x, y) => {
  sleep(2000);
  const targetHex = [];
  for (let i = 0; i < 5; i++) {
    const increment = 2 * i;
    const currX = x + increment;
    const currY = y + increment;
    const color = bot.getPixelColor(currX, currY);
    targetHex.push(color);
  }
  console.log(targetHex.join(","));
};

const sleep = (ms) => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
};

const findGreenPixel = (x, y) => {
  for (let i = 0; i < 5; i++) {
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
    sleep(3000);
    count++;
  }
};

// Init function
(() => {
  const action = process.argv[2].split("=")[1];
  console.log(`Rox fishing bot running, action: ${action}`);
  // Make sure you already run `npm run target` first and copy the target hex to variables.js
  switch (action) {
    case "fish":
      main();
      console.log(`Total Found: ${totalFound}`);
      console.log(`Accuracy: ${Math.round((totalFound / runCount) * 100)}%`);
      break;
    case "target":
      // 1. Screenshot image when found fish (fishing rod with green around the circle image), currently only work on 1920x1080
      // 2. Find target hex by running findTargetHex func and pass the x,y position
      findTargetHex(fishingPos[0], fishingPos[1]);
      console.log("Set target hex to env");
      break;
    default:
      console.log("Invalid action");
      break;
  }
})();
