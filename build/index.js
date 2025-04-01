"use strict";

var _vorpal = _interopRequireDefault(require("vorpal"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var vorpal = (0, _vorpal["default"])();
vorpal.command("hello <name> [number]", "Prints hello to the console").action(function (args, callback) {
  this.log("Hello ".concat(args.name, " should I call you at ").concat(args.number));
  callback();
});
vorpal.command("createOrder <name> <phoneNumber>", "Create an order and saves it as a JSON file").action(function (args, callback) {
  var _this = this;
  var customer = {
    name: args.name,
    phoneNumber: args.phoneNumber
  };

  // Prompt user for how many lemonades they want
  this.prompt({
    type: "number",
    name: "numLemonades",
    message: "How many lemonades would you like to order?"
  }, function (result) {
    return _this.log(result);
  });
});
vorpal.show();