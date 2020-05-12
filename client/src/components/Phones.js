import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Image,
  IconButton,
  Heading,
  Mask,
  Text,
  Card,
  Button,
} from "gestalt";
import Loader from "./Loader";
import { calculatePrice, setCart, getCart } from "../utils/index";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const Phones = (props) => {
  const [phones, setPhones] = useState([]);
  const [brand, setBrand] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loadingPhones, setLoadingPhones] = useState(true);

  const brandId = props.match.params.brandId;

  useEffect(() => {
    const cartItems = getCart();
    setCartItems(cartItems);
  }, []);

  useEffect(() => {
    async function fetchPhones() {
      try {
        const response = await strapi.request("POST", "/graphql", {
          data: {
            query: `query {
              brand(id: "${brandId}") {
                _id
                name    
                phones {
                  _id
                  model
                  description
                  image{
                    url
                  }
                  price
                  brand {
                    _id
                  }
                }
              }
            }`,
          },
        });
        setPhones(response.data.brand.phones);
        setBrand(response.data.brand.name);
        setLoadingPhones(false);
      } catch (err) {
        setLoadingPhones(true);
        console.log(err);
      }
    }
    fetchPhones();
  }, []);

  const addToCart = (phone) => {
    const alreadyInCart = cartItems.findIndex((item) => item._id === phone._id);

    if (alreadyInCart === -1) {
      const updatedItems = cartItems.concat({
        ...phone,
        quantity: 1,
      });
      setCartItems(updatedItems);
      setCart(updatedItems);
    } else {
      const updatedItems = [...cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      setCartItems(updatedItems);
      setCart(updatedItems);
    }
  };

  const deleteItemFromCart = (itemToRemoveId) => {
    const filteredItemsInCart = cartItems.filter(
      (item) => item._id !== itemToRemoveId
    );
    setCartItems(filteredItemsInCart);
    setCart(filteredItemsInCart);
  };
  return (
    <Box
      marginTop={4}
      display="flex"
      justifyContent="center"
      alignItems="start"
      dangerouslySetInlineStyle={{
        __style: {
          flexWrap: "wrap-reverse",
        },
      }}
    >
      {/* phones section */}
      <Box display="flex" direction="column" alignItems="center">
        {/* phones heading */}
        <Box margin={2}>
          <Heading color="orchid">{brand}</Heading>
        </Box>
        {/* Phones */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: "#FFDEE9",
              backgroundImage:
                "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
            },
          }}
          shape="rounded"
          wrap
          display="flex"
          justifyContent="center"
          padding={4}
        >
          {phones.map((phone) => (
            <Box
              key={phone._id}
              paddingY={4}
              marginLeft={2}
              marginTop={6}
              marginRight={2}
              marginBottom={2}
              width={210}
            >
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      src={`${apiUrl}${phone.image.url}`}
                      fit="cover"
                      alt="Brand"
                      naturalHeight={1}
                      naturalWidth={1}
                      dangerouslySetInlineStyle={{
                        __style: {
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Box>
                }
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Box marginBottom={2}>
                    <Text size="xl" color="red">
                      {phone.model}
                    </Text>
                  </Box>
                  <Box marginBottom={2}>
                    <Text size="sm" color="gray">
                      {phone.description.substring(0, 220).concat("...")}
                    </Text>
                  </Box>
                  <Text size="lg" color="red">
                    {" "}
                    Price: ${phone.price}
                  </Text>
                  <Text size="xl" marginTop={2} color="gray">
                    <Button
                      onClick={() => addToCart(phone)}
                      color="blue"
                      text="Add To Cart"
                    />
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* User's Cart */}
      <Box alignSelf="end" marginTop={8} marginLeft={8}>
        <Mask shape="rounded" wash>
          <Box
            display="flex"
            direction="column"
            alignItems="center"
            padding={3}
          >
            <Heading align="center" size="sm">
              Your Cart
            </Heading>
            <Text color="gray" italic>
              {cartItems.length} items selected
            </Text>
            {/* Cart Items */}
            {cartItems.map((item) => (
              <Box key={item._id} display="flex" alignItems="center">
                <Text>
                  {item.model} x {item.quantity} - $
                  {(item.quantity * item.price).toFixed(2)}
                </Text>
                <IconButton
                  accessibilityLabel="Delete item"
                  icon="cancel"
                  size="sm"
                  iconColor="red"
                  onClick={() => deleteItemFromCart(item._id)}
                />
              </Box>
            ))}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              direction="column"
            >
              <Box margin={2}>
                {cartItems.length === 0 && (
                  <Text color="red">Please select some Items</Text>
                )}
              </Box>
              <Text size="lg">
                Total: ${calculatePrice(cartItems).toFixed(2)}
              </Text>
              <Text>
                <Link to="/checkout">Checkout</Link>
              </Text>
            </Box>
          </Box>
        </Mask>
      </Box>
      <Loader show={loadingPhones} />
    </Box>
  );
};

export default Phones;
