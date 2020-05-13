import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Container,
  Heading,
  Icon,
  Image,
  SearchField,
  Spinner,
  Text,
} from "gestalt";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import "./App.css";

import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const App = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await strapi.request("POST", "/graphql", {
          data: {
            query: `query {
              brands {
                _id
                name
                description                
                image {
                  url                              
                }
              }
            }
            `,
          },
        });
        setBrands(response.data.brands);
        setLoadingBrands(false);
      } catch (err) {
        console.log(err);
        setLoadingBrands(true);
      }
    }
    fetchBrands();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.value);
  };

  // if (brands.length === 0) return <div>Loading...</div>;

  const filteredBrands = (brands, searchTerm) => {
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // console.log(brands);
  return (
    <Container>
      {/* Brands Search Field */}
      <Box
        display="flex"
        justifyContent="center"
        marginBottom={4}
        marginTop={4}
      >
        <SearchField
          id="seachField"
          accessibilityLabel="Brands Search field"
          onChange={(e) => handleSearchChange(e)}
          value={searchTerm}
          shape="rounded"
          placeholder="Search Brands"
        />
        <Box marginTop={2} marginLeft={2}>
          <Icon
            icon="eye"
            color={searchTerm ? "orange" : "gray"}
            size={20}
            accessibilityLabel="Filter icon"
          />
        </Box>
      </Box>
      {/* Brands Section */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="column"
        marginBottom={2}
      >
        {/* Brands Header */}
        <Heading color="gray" size="md" marginBottom={5}>
          Phone Brands
        </Heading>
        {/* Brands Cards */}
        <Box
          wrap
          display="flex"
          justifyContent="around"
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: " #FFDEE9",
              backgroundImage:
                "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)",
            },
          }}
          shape="rounded"
        >
          {filteredBrands(brands, searchTerm).map((brand) => (
            <Box
              key={brand._id}
              paddingY={4}
              marginLeft={2}
              marginTop={6}
              marginRight={2}
              marginBottom={2}
              width={200}
            >
              <Card
                image={
                  <Box height={200} width={200}>
                    <Image
                      src={`${apiUrl}${brand.image[0].url}`}
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
                  <Text size="xl" color="red">
                    {brand.name}
                  </Text>
                  <Text size="sm" color="gray">
                    {brand.description.substring(0, 220).concat("...")}
                  </Text>
                  <Text size="xl" marginTop={2} color="gray">
                    <Link
                      to={`/${brand._id}`}
                      dangerouslySetInlineStyle={{
                        __style: {
                          textDecoration: "none",
                        },
                      }}
                    >
                      See Phones
                    </Link>
                  </Text>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
      {/* <Spinner show={loadingBrands} accessibilityLabel="loading spinner" /> */}
      <Loader show={loadingBrands} />
    </Container>
  );
};

export default App;
