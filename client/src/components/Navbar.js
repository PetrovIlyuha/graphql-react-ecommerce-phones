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
      color="midnight"
      padding={1}
      margin={0}
      shape="roundedBottom"
    >
      <NavLink activeClassName="active" to="/signin">
        <Text size="x1" color="white">
          Sign In
        </Text>
      </NavLink>
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
          <Heading size="xs" color="green">
            Gear
          </Heading>
          <Heading size="xs" color="orange">
            Buster
          </Heading>
        </Box>
      </NavLink>
      <NavLink activeClassName="active" to="/signup">
        <Text size="x1" color="white">
          Sign Up
        </Text>
      </NavLink>
    </Box>
  );
};

export default Navbar;
