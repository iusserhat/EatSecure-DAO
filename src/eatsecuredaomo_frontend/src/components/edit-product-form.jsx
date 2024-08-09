import * as Yup from "yup";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import LoadingButton from "@mui/lab/LoadingButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormProvider, { RHFTextField } from "./hook-form";
import { eatsecuredaomo_backend } from "../../../declarations/eatsecuredaomo_backend";
import { useSnackbar } from "notistack";
import Stack from "@mui/material/Stack";

// ----------------------------------------------------------------------

export default function EditProductForm({
  open,
  onClose,
  id,
  mutateProducts,
  mutateHomeProducts,
  currentProduct,
  principle,
}) {
  const [imageData, setImageData] = useState(currentProduct?.image || "");
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    production_date: Yup.string().required("Production date is required"),
    expiration_date: Yup.string().required("Expiration date is required"),
    image: Yup.string().required("Image is required"),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || "",
      production_date: currentProduct?.production_date || "",
      expiration_date: currentProduct?.expiration_date || "",
      image: currentProduct?.image || "",
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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
      const base64Data = reader.result; // Convert file data to base64 format
      setImageData(base64Data); // Update state
      setValue("image", base64Data); // Update 'image' field value in form
    };

    if (file) {
      reader.readAsDataURL(file); // Start reading file to convert it to base64 format
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = { ...data, image: imageData, owner: principle };
      await eatsecuredaomo_backend.update(id, formData);
      mutateProducts();
      mutateHomeProducts();
      enqueueSnackbar("Your Product is updated successfully!");
      onClose();
      reset();
    } catch (error) {
      console.error("Error while updating product:", error);
      enqueueSnackbar("An error occurred while updating the product. Please try again.", { variant: "error" });
    }
  });

  useEffect(() => {
    if (currentProduct) {
      setValue("name", currentProduct?.name || "");
      setValue("production_date", currentProduct?.production_date || "");
      setValue("expiration_date", currentProduct?.expiration_date || "");
      setValue("image", currentProduct?.image || "");
      setImageData(currentProduct?.image || "");
    }
  }, [currentProduct, setValue]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 750 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Update Product</DialogTitle>

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
            {imageData && <img src={imageData} alt="Product preview" height={200} width={400} />}
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
            Update Product
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
