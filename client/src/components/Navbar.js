import React from "react";
import { Box, Image, Heading, Text } from "gestalt";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={73}
      dangerouslySetInlineStyle={{
        __style: {
          backgroundColor: "#0D0221",
          boxShadow: "rgba(0, 0, 0, 0.6) 2px 2px 9px 2px",
        },
      }}
      padding={1}
      margin={0}
      shape="roundedBottom"
    >
      {/* Logo & Title */}
      <NavLink activeClassName="active" exact to="/">
        <Box display="flex" alignItems="center">
          <Box width={60} height={60}>
            <Image
              alt="Shop Logo"
              naturalHeight={2}
              naturalWidth={2}
              src="./icons/logo.svg"
            />
          </Box>
          <Heading size="xs" color="red">
            Gear
          </Heading>
          <Heading size="xs" color="white">
            Buster
          </Heading>
        </Box>
      </NavLink>
      <Box display="flex" direction="row" width={150} justifyContent="around">
        <NavLink activeClassName="active" to="/signin">
          <Text size="xl" color="white" marginRight={4}>
            Sign In
          </Text>
        </NavLink>
        <NavLink activeClassName="active" to="/signup">
          <Text size="xl" color="white">
            Sign Up
          </Text>
        </NavLink>
      </Box>
    </Box>
  );
};

export default Navbar;
