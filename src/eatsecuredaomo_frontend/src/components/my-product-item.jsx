import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import React from "react";
import { useBoolean } from "./hooks/use-boolean.js";
import { ConfirmDialog } from "./custom-dialog/index.js";
import { eatsecuredaomo_backend } from "declarations/eatsecuredaomo_backend/index.js";
import { useSnackbar } from "./snackbar/index.js";
import EditProductForm from "./edit-product-form.jsx";

// ----------------------------------------------------------------------

export default function MyProductItem({
  product,
  listUpdate,
  principal,
  mutateHomeProducts,
}) {
  const { id, name, production_date, expiration_date, image } = product;

  const { enqueueSnackbar } = useSnackbar();
  const quickEdit = useBoolean();
  const confirm = useBoolean();

  const onDeleteRow = async () => {
    try {
      const response = await eatsecuredaomo_backend.deleteProduct(id);
      console.log(response);
      enqueueSnackbar("Your product has been deleted successfully!");
      confirm.onFalse();
      listUpdate();
      mutateHomeProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      enqueueSnackbar("Failed to delete the product.");
    }
  };

  return (
    <>
      <Card>
        <img
          src={image}
          alt="Product Image"
          style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
        />

        <Stack padding={2}>
          <Stack direction="row" gap={2} alignItems="center">
            <Typography variant="subtitle1" color="text.disabled">
              Name of the product:
            </Typography>
            <Typography variant="subtitle1">{name}</Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center">
            <Typography variant="subtitle1" color="text.disabled">
              Production Date:
            </Typography>
            <Typography variant="subtitle1">{production_date}</Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center">
            <Typography variant="subtitle1" color="text.disabled">
              Expiration Date:
            </Typography>
            <Typography variant="subtitle1">{expiration_date}</Typography>
          </Stack>
          {/* If you need price, make sure it's included in the `product` */}
          {/* <Stack direction="row" gap={2} alignItems="center">
            <Typography variant="subtitle1" color="text.disabled">
              Price:
            </Typography>
            <Typography variant="subtitle1">${price}</Typography>
          </Stack> */}
        </Stack>
        <Stack direction="row" gap={2} p={2}>
          <Button variant="contained" color="error" onClick={confirm.onTrue}>
            Delete
          </Button>
          <Button variant="outlined" onClick={quickEdit.onTrue}>
            Edit
          </Button>
        </Stack>
        <ConfirmDialog
          open={confirm.value}
          onClose={confirm.onFalse}
          title="Delete"
          content="Are you sure you want to delete this product?"
          action={
            <Button variant="contained" color="error" onClick={onDeleteRow}>
              Delete
            </Button>
          }
        />
        <EditProductForm
          open={quickEdit.value}
          onClose={quickEdit.onFalse}
          id={id}
          mutateProducts={listUpdate}
          currentProduct={product}
          principal={principal}
          mutateHomeProducts={mutateHomeProducts}
        />
      </Card>
    </>
  );
}
