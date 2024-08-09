import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { eatsecuredaomo_backend } from "../../../declarations/eatsecuredaomo_backend";
import { Typography } from "@mui/material";
import MyProductItem from "./my-product-item.jsx";

// ----------------------------------------------------------------------

export default function ListMyProducts({
  open,
  onClose,
  principal,
  mutateHomeProducts,
}) {
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]); // Fetch products when dialog opens

  const fetchProducts = async () => {
    try {
      const products = await eatsecuredaomo_backend.getUserProducts(principal);
      setMyProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 950 },
      }}
    >
      <DialogTitle>My Products!</DialogTitle>

      <DialogContent>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          }}
        >
          {myProducts.length > 0 ? (
            myProducts.map((product) => (
              <MyProductItem
                key={product.id}
                product={product}
                listUpdate={fetchProducts}
                principal={principal}
                mutateHomeProducts={mutateHomeProducts}
              />
            ))
          ) : (
            <Typography variant="h4" padding={5}>
              Right now, you don't have any products :)
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ pr: 3, pb: 3 }}>
        <Button variant="contained" onClick={onClose}>
          Ok, I've seen my products :)
        </Button>
      </DialogActions>
    </Dialog>
  );
}
