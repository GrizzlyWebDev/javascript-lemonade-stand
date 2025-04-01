import fs from "fs";

const curry =
  (f, arr = []) =>
  (...args) =>
    ((a) => (a.length >= f.length ? f(...a) : curry(f, a)))([...arr, ...args]);

const calculateLemonadePrice = (lemonade) => {
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

const calculateOrderTotal = (lemonades) => {
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

export const buildQuestionArray = (val, i) => [
  {
    type: "number",
    name: `lemonJuice${i}`,
    default: 1,
    message: `How many cups of lemon juice do you want in lemonade ${i + 1}? `,
  },
  {
    type: "number",
    name: `water${i}`,
    default: 1,
    message: `How many cups of water do you want in lemonade ${i + 1}? `,
  },
  {
    type: "number",
    name: `sugar${i}`,
    default: 1,
    message: `How many cups of sugar do you want in lemonade ${i + 1}? `,
  },
  {
    type: "number",
    name: `iceCubes${i}`,
    default: 4,
    message: `How many ice cubes do you want in lemonade ${i + 1}? `,
  },
];

export const createLemonade = curry((response, curr, i) => ({
  lemonJuice: Number(response["lemonJuice" + i]),
  water: Number(response["water" + i]),
  sugar: Number(response["sugar" + i]),
  iceCubes: Number(response["iceCubes" + i]),
}));

export const addLemonadeToOrder = (originalOrder, lemonade) => ({
  ...originalOrder,
  lemonades: [
    ...originalOrder.lemonades,
    { ...lemonade, price: calculateLemonadePrice(lemonade) },
  ],
});

export const updateOrderTotal = (order) => ({
  ...order,
  total: calculateOrderTotal(order.lemonades),
});
