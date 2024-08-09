import * as Yup from "yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import FormProvider, { RHFTextField } from "./components/hook-form";
import { eatsecuredaomo_backend } from "../../declarations/eatsecuredaomo_backend";
import { useAuth } from "./use-auth-client";
import { useSnackbar } from "notistack"; // Import useSnackbar for user feedback

export default function CreateProductForm({ onProductCreated }) { 
  const { principal } = useAuth();
  const [imageData, setImageData] = useState(""); 
  const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    production_date: Yup.string().required("Production date is required"),
    expiration_date: Yup.string().required("Expiration date is required"),
    price: Yup.number().required("Price is required").positive("Price must be positive"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.string().required("Image is required")
  });

  const defaultValues = {
    name: "",
    production_date: "",
    expiration_date: "",
    price: "",
    category: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = { ...data, image: imageData, owner: principal };
      console.log("Submitting form data:", formData);
      await eatsecuredaomo_backend.createProduct(formData); 
      enqueueSnackbar("Product created successfully!", { variant: "success" });
      onProductCreated();
    } catch (error) {
      console.error("Error creating product:", error);
      enqueueSnackbar("Failed to create product. Please try again.", { variant: "error" });
    }
  });

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

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        mt={2}
        rowGap={3}
        columnGap={2}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
        }}
      >
        <RHFTextField name="name" label="Product Name" required />
        <RHFTextField name="production_date" label="Production Date" required />
        <RHFTextField name="expiration_date" label="Expiration Date" required />
        <RHFTextField name="price" label="Price" required type="number" />
        <RHFTextField name="category" label="Category" required />
        <RHFTextField name="description" label="Description" required multiline rows={4} />
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Add Product
        </LoadingButton>
      </Box>
    </FormProvider>
  );
}
