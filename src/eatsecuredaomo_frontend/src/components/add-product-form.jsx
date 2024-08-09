import * as Yup from "yup";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormProvider, { RHFTextField } from "./hook-form";
import { eatsecuredaomo_backend } from "../../../declarations/eatsecuredaomo_backend";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

export default function AddProductForm({ open, onClose, principal, mutateProducts }) {
  const [imageData, setImageData] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    id: Yup.string().required(),
    name: Yup.string().required(),
    production_date: Yup.string().required(), // Changed to string
    expiration_date: Yup.string().required(), // Changed to string
    image: Yup.string().required(), 
    owner: Yup.string().required(),
    description: Yup.string().required(), // Added description validation
  });

  const defaultValues = useMemo(
    () => ({
      id: "",
      name: "",
      production_date: "",
      expiration_date: "",
      image: "",
      owner: principal, // Automatically set to principal
      description: "", // Added description
    }),
    [principal],
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result;
      setImageData(base64Data);
      setValue("image", base64Data);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = { ...data, image: imageData };
      await eatsecuredaomo_backend.createProduct(formData);
      mutateProducts();
      enqueueSnackbar("Your product has been added successfully!");
      onClose();
      console.info("DATA", data);
      reset();
      setImageData("");
    } catch (error) {
      console.error("Error adding product:", error);
      enqueueSnackbar("An error occurred while adding the product. Please try again.", { variant: "error" });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 750 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add New Product</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            pt={1}
            pb={3}
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
          >
            <RHFTextField name="name" label="Product Name" required />
            <RHFTextField name="production_date" label="Production Date" required />
            <RHFTextField name="expiration_date" label="Expiration Date" required />
            <RHFTextField name="description" label="Description" required multiline rows={4} />
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <label htmlFor="file-upload" className="custom-file-upload">
              {imageData ? "Change Image" : "Upload Image"}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {imageData && (
              <img src={imageData} alt="product" height={200} width={400} />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add Product
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
