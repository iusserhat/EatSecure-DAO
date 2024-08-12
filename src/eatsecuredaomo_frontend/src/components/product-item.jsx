import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { id, name, production_date, expiration_date, image, owner } = product;

 
  return (
    <Card>
      <img
        src={image}
        alt="Selected image"
        style={{ maxWidth: "100%", maxHeight: "200px" }}
      />

      <Stack padding="15px">
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            {" "}
            Name of the product:{" "}
          </Typography>
          <Typography variant="subtitle1"> {name} </Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            {" "}
            Production Date:{" "}
          </Typography>
          <Typography variant="subtitle1"> {production_date} </Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            {" "}
            Expiration Date:{" "}
          </Typography>
          <Typography variant="subtitle1"> {expiration_date} </Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            {" "}
              id :{" "}
          </Typography>
          <Typography variant="subtitle1"> {id} </Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            {" "}
            Owner:{" "}
          </Typography>
          <Typography variant="subtitle1"> {owner.toString()} </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}