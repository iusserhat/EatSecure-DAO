import { useAuth, AuthProvider } from "./use-auth-client";
import CreateProductForm from "./createProduct";
import ProductList from "./components/product-list";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import React from "react";
import { HttpAgent } from "@dfinity/agent";
import LoggedIn from "./LoggedIn"; 
import LoggedOut from "./LoggedOut";
import Header from "./header";
import { eatsecuredaomo_backend } from "../../declarations/eatsecuredaomo_backend"; 
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { SnackbarProvider } from "./components/snackbar";

function App() {
  const { isAuthenticated, principal } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []); // Fetch products on component mount

  const fetchProducts = async () => {
    try {
      const products = await eatsecuredaomo_backend.list();
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductCreated = () => {
    fetchProducts(); 
    console.error("Error fetching products after creation:");
  };

  return (
    <main>
      <Box sx={{ flexGrow: 1, pb: 5, pl: 10, pr: 10 }}>
        <Grid container columns={16} spacing={1}>
          <Grid item xs={16} md={10} padding={0}>
            <img
              src="/logo.png"
              alt="Your logo"
              height="200"
              style={{ borderRadius: "10px" }}
            />
          </Grid>
          <Grid item xs={16} md={6}>
            <Card
              sx={{
                minHeight: 200,
                maxHeight: 200,
                borderRadius: "10px",
              }}
            >
              {isAuthenticated ? (
                <LoggedIn updateList={handleProductCreated} />
              ) : (
                <LoggedOut />
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ p: 1, paddingLeft: 10, paddingRight: 10 }}>
        <ProductList products={products} />
      </Box>
    </main>
  );
}

export default () => (
  <AuthProvider>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </AuthProvider>
);