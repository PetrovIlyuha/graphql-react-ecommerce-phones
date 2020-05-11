import React from "react";
import { GridLoader } from "react-spinners";
import { Box } from "gestalt";

const Loader = ({ show }) => {
  return (
    show && (
      <Box
        position="fixed"
        dangerouslySetInlineStyle={{
          __style: {
            bootom: 400,
            left: "50%",
            transform: "translateX(-50%)",
          },
        }}
      >
        <GridLoader color="grey" size={30} margin={3} />
      </Box>
    )
  );
};

export default Loader;
