import React from "react";
import { Modal, Box, Button, Text, Spinner } from "gestalt";
import { calculatePrice } from "../utils";

const ConfirmationModal = ({
  orderProcessing,
  cartItems,
  closeModal,
  handleSubmitOrder,
  checkoutInfo,
}) => (
  <Modal
    accessibilityModalLabel="Confirm Your Order"
    accessibilityCloseLabel="close"
    heading="Confirm your order"
    onDismiss={closeModal}
    footer={
      <Box
        display="flex"
        marginRight={-1}
        marginLeft={-1}
        justifyContent="center"
      >
        <Box padding={1}>
          <Button
            size="lg"
            color="blue"
            text="Submit"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
        <Box padding={1}>
          <Button
            size="lg"
            color="red"
            text="Cancel"
            disabled={orderProcessing}
            onClick={closeModal}
          />
        </Box>
      </Box>
    }
    role="alertdialog"
    size="sm"
  >
    {!orderProcessing && (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        padding={2}
        color="lightWash"
      >
        {cartItems.map((item) => (
          <Box key={item._id} padding={1}>
            <Text size="lg" color="red">
              {item.model} x {item.quantity} = ${item.quantity * item.price}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text size="lg" bold>
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
        <Box color="darkGray" shape="rounded">
          <Box marginBottom={2} paddingX={3} color="darkGray">
            <Text color="white" paddingX={3}>
              Shipping Address: {checkoutInfo.address}
            </Text>
          </Box>
          <Box marginBottom={2} paddingX={3} color="darkGray">
            <Text color="white" paddingX={3}>
              Postal Code: {checkoutInfo.postalCode}
            </Text>
          </Box>
          <Box marginBottom={2} paddingX={3} color="darkGray">
            <Text color="white" paddingX={3}>
              Delivery City: {checkoutInfo.city}
            </Text>
          </Box>
          <Box marginBottom={2} paddingX={3} color="darkGray">
            <Text color="white" paddingX={3}>
              Email for confirmation: {checkoutInfo.confirmationEmailAddress}
            </Text>
          </Box>
        </Box>
      </Box>
    )}
    {/* Order processing spinner */}
    <Spinner
      show={orderProcessing}
      accessibilityLabel="Order process spinner"
    />
    {orderProcessing && (
      <Text align="center" italic>
        Submitting your Order...
      </Text>
    )}
  </Modal>
);

export default ConfirmationModal;
