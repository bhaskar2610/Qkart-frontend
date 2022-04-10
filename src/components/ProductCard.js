import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  // console.log("card");
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt="bag"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h3" component="div">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />

      </CardContent>
      <CardActions className="card-actions">
        <Button variant="contained" className="card-button" onClick={handleAddToCart}><AddShoppingCartOutlined />ADD TO CART</Button>
      </CardActions>

      {/* <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {product.name}
        </Typography>
        <Typography variant="h2">
          {product.cost}
        </Typography>
      </CardContent> */}
    </Card>
  );
};

export default ProductCard;
