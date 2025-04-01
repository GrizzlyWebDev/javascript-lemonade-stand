import fs from "fs";

export const calculateLemonadePrice = (lemonade) => {
  let result = 0.75;
  for (let key in lemonade) {
    switch (key) {
      case "lemonJuice":
        result += lemonade[key] * 0.3;
        break;
      case "water":
        result += lemonade[key] * 0.01;
        break;
      case "sugar":
        result += lemonade[key] * 0.2;
        break;
      case "iceCubes":
        result += lemonade[key] * 0.05;
        break;
      default:
        break;
    }
  }
  return result;
};

export const calculateOrderTotal = ({ lemonades }) => {
  return lemonades.reduce((total, currentLemonade) => {
    return (total += currentLemonade.price);
  }, 0.0);
};

export const writeFileSync = (fileName, order) => {
  fs.writeFileSync(fileName, JSON.stringify(order));
};

export const readAllFiles = (dirName) => {
  const orders = [];
  for (let name of fs.readdirSync(dirName)) {
    orders.push(JSON.parse(fs.readFileSync(dirName + "/" + name)));
  }
  return orders;
};
