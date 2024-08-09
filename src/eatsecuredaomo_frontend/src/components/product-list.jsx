import Box from "@mui/material/Box";
import ProductItem from "./product-item"; // Düzeltilmiş isim
import { Typography } from "@mui/material";

export default function ProductList({ products }) {
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
        {products.length > 0 ? (
          products.map((product) => (
            <ProductItem key={product.id} product={product} /> // Düzeltilmiş isim
          ))
        ) : (
          <Typography variant="h4" padding={10}>
            Şeffaf ürün takibi için yenilikçi platform!
          </Typography>
        )}
      </Box>
    </>
  );
}
