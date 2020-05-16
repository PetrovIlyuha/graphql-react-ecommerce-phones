import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmModal";
import { Container, Box, Heading, Text, TextField } from "gestalt";
import { withRouter } from "react-router-dom";
import {
  Elements,
  StripeProvider,
  CardElement,
  injectStripe,
} from "react-stripe-elements";
import ToastMessage from "./ToastMessage";
import {
  getCart,
  calculateAmount,
  calculatePrice,
  clearCart,
} from "../utils/index";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const Checkout = ({ history, stripe }) => {
  const [checkout, setCheckout] = useState({
    toast: false,
    message: "",
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: "",
    cartItems: [],
    orderProcessing: false,
    modal: false,
  });

  useEffect(() => {
    setCheckout({ ...checkout, cartItems: getCart() });
  }, []);

  const handleChange = ({ event, value }) => {
    event.persist();
    setCheckout({ ...checkout, [event.target.name]: value });
  };

  const isFormEmpty = ({
    address,
    postalCode,
    city,
    confirmationEmailAddress,
  }) => {
    return !address || !postalCode || !city || !confirmationEmailAddress;
  };

  const handleConfirmOrder = async (event) => {
    event.preventDefault();
    if (isFormEmpty(checkout)) {
      showToast("Fill in all Fields!");
      return;
    }
    setCheckout({ ...checkout, modal: true });
  };

  const handleSubmitOrder = async () => {
    const { cartItems, city, address, postalCode } = checkout;
    setCheckout({ ...checkout, orderProcessing: true });
    const amount = calculateAmount(cartItems);
    let token;
    try {
      const response = await stripe.createToken();
      token = response.token.id;
      await strapi.createEntry("orders", {
        amount,
        phones: cartItems,
        city,
        postalCode,
        address,
        token,
      });
      setCheckout({ ...checkout, orderProcessing: false, modal: false });
      clearCart();
      showToast("Your order has been successfully submitted!", true);
    } catch (err) {
      setCheckout({ ...checkout, orderProcessing: false, modal: false });
      showToast(err.message);
    }
  };

  const closeModal = () => setCheckout({ ...checkout, modal: false });

  const showToast = (message, redirect = false) => {
    setCheckout({ ...checkout, toast: true, message });
    setTimeout(() => {
      setCheckout({ ...checkout, toast: false, message: "" });
      redirect && history.push("/");
    }, 2000);
  };
  const { toast, message, cartItems, orderProcessing, modal } = checkout;
  return (
    <Container>
      <Box
        color="darkWash"
        margin={4}
        padding={4}
        shape="rounded"
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Heading color="midnight" size="md">
          Checkout Form
        </Heading>
        {/* User Cart */}
        {cartItems.length > 0 ? (
          <React.Fragment>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              direction="column"
              marginTop={3}
              marginBottom={6}
            >
              <Text color="darkGray" italic>
                {cartItems.length}{" "}
                {`${cartItems.length > 1 ? "Items" : "Item"}`} for Checkout
              </Text>
              <Box padding={2}>
                {cartItems.map((item) => (
                  <Box
                    key={item._id}
                    padding={2}
                    color="midnight"
                    marginBottom={2}
                    display="flex"
                    direction="row"
                    justifyContent="between"
                    dangerouslySetInlineStyle={{
                      __style: {
                        width: "300px",
                      },
                    }}
                  >
                    <Text color="white">
                      {item.model} X {item.quantity}
                    </Text>
                    <Text color="white">- ${item.quantity * item.price}</Text>
                  </Box>
                ))}
              </Box>
              <Text bold>Total Amount: ${calculatePrice(cartItems)}</Text>
            </Box>
            {/* Checkout Form */}
            <form
              style={{
                display: "inline-block",
                textAlign: "center",
                maxWidth: 450,
              }}
              onSubmit={handleConfirmOrder}
            >
              {/* Username input */}
              <TextField
                id="address"
                type="text"
                name="address"
                placeholder="Shipping address"
                onChange={handleChange}
              />
              {/* Email input */}
              <Box marginTop={2}>
                <TextField
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={2} marginBottom={2}>
                <TextField
                  id="city"
                  type="text"
                  name="city"
                  placeholder="Yout city of delivery"
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={2} marginBottom={2}>
                <TextField
                  id="confirmationEmailAddress"
                  type="email"
                  name="confirmationEmailAddress"
                  placeholder="Confirmation email address"
                  onChange={handleChange}
                />
              </Box>
              {/* Credir card Element */}
              <CardElement
                id="stripe__input"
                onReady={(input) => input.focus()}
              />
              <button id="stripe__button" type="submit">
                Submit
              </button>
            </form>
          </React.Fragment>
        ) : (
          <Text bold>No items in Cart yet!</Text>
        )}
      </Box>
      {/* Confirmation modal */}
      {modal && (
        <ConfirmationModal
          orderProcessing={orderProcessing}
          cartItems={cartItems}
          closeModal={closeModal}
          handleSubmitOrder={handleSubmitOrder}
          checkoutInfo={checkout}
        />
      )}
      {toast && <ToastMessage message={message} />}
    </Container>
  );
};

const CheckoutForm = withRouter(injectStripe(Checkout));

const StripeCheckout = () => (
  <StripeProvider apiKey="pk_test_HK4R5Dst2sfcx7o69v2zbBpA00isZSH2xt">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default StripeCheckout;
