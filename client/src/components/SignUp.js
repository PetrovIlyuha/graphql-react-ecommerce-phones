import React, { useState } from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import ToastMessage from "./ToastMessage";

import { setToken } from "../utils";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const SignUp = ({ history }) => {
  const [userState, setUserState] = useState({
    username: "",
    email: "",
    password: "",
    toast: false,
    message: "",
    loading: false,
  });
  const handleChange = ({ event, value }) => {
    event.persist();
    setUserState({ ...userState, [event.target.name]: value });
  };

  const isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isFormEmpty(userState)) {
      showToast("Fill in all Fields!");
      return;
    }
    // Sign up user
    try {
      setUserState({ ...userState, loading: true });
      const { username, email, password } = userState;
      const response = await strapi.register(username, email, password);
      setUserState({ ...userState, loading: false });
      setToken(response.jwt);
      redirectUser("/");
    } catch (err) {
      setUserState({ ...userState, loading: false });
      showToast(err.message);
    }
  };

  const redirectUser = (path) => history.push(path);

  const showToast = (message) => {
    setUserState({ ...userState, toast: true, message });
    setTimeout(() => {
      setUserState({ ...userState, toast: false, message: "" });
    }, 2000);
  };

  const { toast, message, loading } = userState;
  return (
    <Container>
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: "#ebe2da",
          },
        }}
        margin={4}
        padding={4}
        shape="rounded"
        display="flex"
        justifyContent="center"
      >
        {/* Sign Up Form */}
        <form
          style={{
            display: "inline-block",
            textAlign: "center",
            maxWidth: 450,
          }}
          onSubmit={handleSubmit}
        >
          <Box
            marginBottom={2}
            display="flex"
            direction="column"
            alignItems="center"
          >
            <Heading color="midnight" size="md">
              Let's Get Going!
            </Heading>
            <Text italic color="orchid">
              Sign Up to order some Phones!
            </Text>
          </Box>
          {/* Username input */}
          <TextField
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          {/* Email input */}
          <Box marginTop={2}>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Your email...We will not spam you..."
              onChange={handleChange}
            />
          </Box>
          <Box marginTop={2} marginBottom={2}>
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Choose your password..."
              onChange={handleChange}
            />
          </Box>
          <Button
            disabled={loading}
            color="red"
            text="Sign Up"
            type="submit"
            inline
          />
        </form>
      </Box>
      {toast && <ToastMessage message={message} />}
    </Container>
  );
};

export default SignUp;
