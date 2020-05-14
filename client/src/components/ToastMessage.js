import React from "react";
import { Toast, Box } from "gestalt";

const ToastMessage = ({ message }) => {
  return (
    <Box display="flex" justifyContent="center">
      <Toast color="orange" text={message} paddingLeft={5} />
    </Box>
  );
};

export default ToastMessage;
