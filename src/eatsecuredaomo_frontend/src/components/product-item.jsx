import { Typography, TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { id, name, production_date, expiration_date, image, owner } = product;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Kullanıcı ID'si oluşturma
  const userId = uuidv4();  // Her kullanıcı için benzersiz bir ID oluşturur

  // Component mount olduğunda localStorage'dan ürün bazlı yorumları yükle
  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    setComments(savedComments);
  }, [id]);

  // Yorum eklendiğinde localStorage'a kaydet
  const handleAddComment = () => {
    if (comment.trim()) {
      const newComments = [...comments, { userId, text: comment }];
      setComments(newComments);
      localStorage.setItem(`comments_${id}`, JSON.stringify(newComments));
      setComment(""); // Input alanını temizle
    }
  };

  return (
    <Card>
      <img
        src={image}
        alt="Selected image"
        style={{ maxWidth: "100%", maxHeight: "200px" }}
      />

      <Stack padding="15px">
        {/* Mevcut Ürün Detayları */}
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            Name of the product:
          </Typography>
          <Typography variant="subtitle1">{name}</Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            Production Date:
          </Typography>
          <Typography variant="subtitle1">{production_date}</Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            Expiration Date:
          </Typography>
          <Typography variant="subtitle1">{expiration_date}</Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            ID:
          </Typography>
          <Typography variant="subtitle1">{id}</Typography>
        </Stack>
        <Stack direction="row" gap={3} alignItems="center">
          <Typography variant="subtitle1" color="text.disabled">
            Owner:
          </Typography>
          <Typography variant="subtitle1">{owner.toString()}</Typography>
        </Stack>

        {/* Yorum Bölümü */}
        <Stack direction="column" gap={2} marginTop={3}>
          <TextField
            label="Add a Comment"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment}>
            Submit Comment
          </Button>

          {/* Yorumları Göster */}
          <List>
            {comments.map((cmt, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={cmt.text}
                  secondary={`Comment by ID: ${cmt.userId}`}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Card>
  );
}
