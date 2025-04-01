"use strict";

var _vorpal = _interopRequireDefault(require("vorpal"));
var _lib = require("./lib");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var vorpal = (0, _vorpal["default"])();
vorpal.command("hello <name> [number]", "Prints hello to the console").action(function (args, callback) {
  this.log("Hello ".concat(args.name, " should I call you at ").concat(args.number));
  callback();
});
vorpal.command("createOrder <name> <phoneNumber>", "Create an order and saves it as a JSON file").action(function (args, callback) {
  var _this = this;
  var order = {
    total: 0,
    lemonades: [],
    customer: {
      name: args.name,
      phoneNumber: args.phoneNumber
    },
    lemonadeStand: {
      name: "Cooksys LemonadeStand"
    }
  };

  // Prompt user for how many lemonades they want
  this.prompt({
    type: "number",
    name: "numLemonades",
    "default": 1,
    message: "How many lemonades would you like to order? "
  }, function (_ref) {
    var numLemonades = _ref.numLemonades;
    var questions = [];
    for (var i = 1; i <= Number.parseInt(numLemonades); i++) {
      questions.push({
        type: "number",
        name: "lemonJuice" + i,
        "default": 1,
        message: "How many cups of lemon juice do you want in lemonade ".concat(i, "? ")
      });
      questions.push({
        type: "number",
        name: "water" + i,
        "default": 1,
        message: "How many cups of water do you want in lemonade ".concat(i, "? ")
      });
      questions.push({
        type: "number",
        name: "sugar" + i,
        "default": 1,
        message: "How many cups of sugar do you want in lemonade ".concat(i, "? ")
      });
      questions.push({
        type: "number",
        name: "iceCubes" + i,
        "default": 1,
        message: "How many ice cubes do you want in lemonade ".concat(i, "? ")
      });
    }
    _this.prompt(questions, function (response) {
      // create a lemonade object for each lemonade in the order
      for (var _i = 1; _i <= Number.parseInt(numLemonades); _i++) {
        order.lemonades.push({
          lemonJuice: Number(response["lemonJuice" + _i]),
          water: Number(response["water" + _i]),
          sugar: Number(response["sugar" + _i]),
          iceCubes: Number(response["iceCubes" + _i])
        });
      }

      // calculate each lemonade price
      var _iterator = _createForOfIteratorHelper(order.lemonades),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var lemonade = _step.value;
          lemonade.price = (0, _lib.calculateLemonadePrice)(lemonade);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      order.total = (0, _lib.calculateOrderTotal)(order);
      (0, _lib.writeFileSync)(order.lemonadeStand.name + "/" + order.customer.name + ".json", order);
      callback();
    });
  });
});
vorpal.command("getOrders <lemonadeStand>", "Get all orders for the given lemonade stand.").action(function (_ref2, callback) {
  var lemonadeStand = _ref2.lemonadeStand;
  var orders = (0, _lib.readAllFiles)(lemonadeStand);
  this.log("There are ".concat(orders.length, " orders at ").concat(lemonadeStand));
  var _iterator2 = _createForOfIteratorHelper(orders),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var order = _step2.value;
      this.log("Order ".concat(orders.indexOf(order) + 1));
      this.log("Total Price: ".concat(order.total));
      this.log("Lemonades: ".concat(order.lemonades));
      this.log("Customer: ".concat(order.customer));
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
});
vorpal.show();