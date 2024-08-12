import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ProductItem from "./product-item"; 
import { eatsecuredaomo_backend } from 'declarations/eatsecuredaomo_backend/index.js'; // Canister importu
import { Typography } from "@mui/material";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Backend'den ürün verilerini çekme
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await eatsecuredaomo_backend.listProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Ürünler çekilirken bir hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []); // Boş bağımlılık dizisi, bileşen ilk yüklendiğinde çalışır

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </Box>
      {!products.length && (
        <Typography variant="h4" padding={10}>
          "Şeffaf ve Yenilikçi Ürün Takip Platformu"
        </Typography>
      )}
    </>
  );
}
