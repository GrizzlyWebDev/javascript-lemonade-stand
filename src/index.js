import Vorpal from "vorpal";
import {
  calculateLemonadePrice,
  calculateOrderTotal,
  readAllFiles,
  writeFileSync,
} from "./lib";

const vorpal = Vorpal();

vorpal
  .command(
    "createOrder <name> <phoneNumber>",
    "Create an order and saves it as a JSON file"
  )
  .action(function (args, callback) {
    const order = {
      total: 0,
      lemonades: [],
      customer: {
        name: args.name,
        phoneNumber: args.phoneNumber,
      },
      lemonadeStand: {
        name: "Cooksys LemonadeStand",
      },
    };

    // Prompt user for how many lemonades they want
    this.prompt(
      {
        type: "number",
        name: "numLemonades",
        default: 1,
        message: "How many lemonades would you like to order? ",
      },
      ({ numLemonades }) => {
        const questions = [];
        for (let i = 1; i <= Number.parseInt(numLemonades); i++) {
          questions.push({
            type: "number",
            name: "lemonJuice" + i,
            default: 1,
            message: `How many cups of lemon juice do you want in lemonade ${i}? `,
          });
          questions.push({
            type: "number",
            name: "water" + i,
            default: 1,
            message: `How many cups of water do you want in lemonade ${i}? `,
          });
          questions.push({
            type: "number",
            name: "sugar" + i,
            default: 1,
            message: `How many cups of sugar do you want in lemonade ${i}? `,
          });
          questions.push({
            type: "number",
            name: "iceCubes" + i,
            default: 1,
            message: `How many ice cubes do you want in lemonade ${i}? `,
          });
        }
        this.prompt(questions, (response) => {
          // create a lemonade object for each lemonade in the order
          for (let i = 1; i <= Number.parseInt(numLemonades); i++) {
            order.lemonades.push({
              lemonJuice: Number(response["lemonJuice" + i]),
              water: Number(response["water" + i]),
              sugar: Number(response["sugar" + i]),
              iceCubes: Number(response["iceCubes" + i]),
            });
          }

          // calculate each lemonade price
          for (let lemonade of order.lemonades) {
            lemonade.price = calculateLemonadePrice(lemonade);
          }

          order.total = calculateOrderTotal(order);

          writeFileSync(
            order.lemonadeStand.name + "/" + order.customer.name + ".json",
            order
          );
          callback();
        });
      }
    );
  });

vorpal
  .command(
    "getOrders <lemonadeStand>",
    "Get all orders for the given lemonade stand."
  )
  .action(function ({ lemonadeStand }, callback) {
    const orders = readAllFiles(lemonadeStand);
    this.log(`There are ${orders.length} orders at ${lemonadeStand}`);
    for (let order of orders) {
      this.log(`Order ${orders.indexOf(order) + 1}:`);
      this.log(`Total Price: $${order.total.toFixed(2)}`);
      this.log(`Lemonades: `);
      this.log(order.lemonades);
      this.log(`Customer: `);
      this.log(order.customer);
    }
  });

vorpal.show();
