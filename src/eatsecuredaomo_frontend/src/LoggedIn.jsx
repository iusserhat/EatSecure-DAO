import React, { useEffect } from "react";
import { useAuth } from "./use-auth-client.jsx";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useBoolean } from "./components/hooks/use-boolean.js";
import UserQuickEditForm from "./components/user-quick-edit-form.jsx";
import Button from "@mui/material/Button";
import AddProductForm from "./components/add-product-form.jsx"; // Updated
import ListMyProducts from "./components/list-my-products.jsx"; // Updated

function LoggedIn({ updateList }) { 
  const [result, setResult] = React.useState("");

  const defaultUser = "Product Manager";

  const defaultAvatar = "./defaultAvatar.png";

  const [currentUser, setCurrentUser] = React.useState();

  const { whoamiActor, logout, principal } = useAuth();

  console.log("currentUser: ", currentUser);

  const quickEdit = useBoolean();

  const addProduct = useBoolean(); // Updated

  const listProduct = useBoolean(); // Updated

  const getUser = async () => {
    const user = await whoamiActor.getCurrentUser(principal);
    console.log("user returned backend", user);
    setCurrentUser(user[0]);
  };

  useEffect(() => {
    getUser();
    async function greetuser() {
      const whoami = await whoamiActor.greet();
      setResult(whoami.toString());
    }
    greetuser();
  }, []);

  const handleUpdateUser = () => {
    getUser(); // Re-fetch user after profile update
  };

  return (
    <>
      <Stack
        direction="column"
        p={2}
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption">{result}</Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <img
              src={currentUser?.avatar ? currentUser?.avatar : defaultAvatar}
              alt="avatar"
              height={100}
              width={100}
              style={{ borderRadius: "50px" }}
            />
            <Typography>
              Hi {currentUser?.name ? currentUser?.name : defaultUser}!
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Stack
              direction="column"
              alignItems="left"
              justifyContent="center"
              gap={2}
            >
              <Button variant="outlined" onClick={listProduct.onTrue}>
                My Products
              </Button>
              <Button variant="outlined" onClick={addProduct.onTrue}>
                Add Product
              </Button>
            </Stack>
            <Stack
              direction="column"
              alignItems="right"
              justifyContent="center"
              gap={2}
            >
              <Button variant="outlined" onClick={quickEdit.onTrue}>
                Update Profile
              </Button>
              <Button variant="outlined" onClick={logout}>
                Log Out
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <UserQuickEditForm
        currentUser={currentUser}
        onClose={quickEdit.onFalse}
        open={quickEdit.value}
        principal={principal}
        mutatePanel={handleUpdateUser}
      />
      <AddProductForm
        open={addProduct.value}
        onClose={addProduct.onFalse}
        principal={principal}
        mutateProducts={updateList}
      />
      <ListMyProducts
        open={listProduct.value}
        onClose={listProduct.onFalse}
        principal={principal}
        mutateHomeProducts={updateList}
      />
    </>
  );
}

export default LoggedIn; // Doğru export
