"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const stripe = require("stripe")("sk_test_5WbbautHkKqAr0dHO1tsPAkg00ioLvjk0J");

create: async (ctx) => {
  const { address, amount, phones, postalCode, token, city } = ctx.request.body;
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: "usd",
    description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
    source: token,
  });
  // creating an order in our database
  const order = await strapi.services.order.add({
    user: ctx.state.user._id,
    address,
    amount,
    phones,
    postalCode,
    city,
  });
  return order;
};

module.exports = { create };
