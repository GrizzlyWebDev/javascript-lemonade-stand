"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateOrderTotal = exports.calculateLemonadePrice = void 0;
var calculateLemonadePrice = exports.calculateLemonadePrice = function calculateLemonadePrice(lemonade) {
  var result = 0.75;
  for (var key in lemonade) {
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
var calculateOrderTotal = exports.calculateOrderTotal = function calculateOrderTotal(_ref) {
  var lemonades = _ref.lemonades;
  return lemonades.reduce(function (total, currentLemonade) {
    total += currentLemonade.price;
  }, 0.0);
};