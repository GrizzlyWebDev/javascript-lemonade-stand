import Vorpal from "vorpal";
import {
  addLemonadeToOrder,
  buildQuestionArray,
  createLemonade,
  readAllFiles,
  updateOrderTotal,
  writeFileSync,
} from "./lib";

const vorpal = Vorpal();

vorpal
  .command(
    "createOrder <name> <phoneNumber>",
    "Create an order and saves it as a JSON file"
  )
  .action(function (args, callback) {
    // Prompt user for how many lemonades they want
    this.prompt(
      {
        type: "number",
        name: "numLemonades",
        default: 1,
        message: "How many lemonades would you like to order? ",
      },
      ({ numLemonades }) => {
        const questions = [...Array(Number(numLemonades))].flatMap(
          buildQuestionArray
        );

        this.prompt(questions, (response) => {
          // create a lemonade object for each lemonade in the order
          const order = updateOrderTotal(
            [...Array(Number(numLemonades))]
              .map(createLemonade(response))
              .reduce(addLemonadeToOrder, {
                total: 0,
                lemonades: [],
                customer: {
                  name: args.name,
                  phoneNumber: args.phoneNumber,
                },
                lemonadeStand: {
                  name: "Cooksys LemonadeStand",
                },
              })
          );

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
