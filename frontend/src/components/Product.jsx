import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ _id, image, name, numReviews, rating, price }) => {
  return (
    <Card className="my-3 p-2 rounded">
      <Link to={`/product/${_id}`}>
        <Card.Img
          src={`${process.env.REACT_APP_BACKEND_URL}${image}`}
          variant="top"
        ></Card.Img>
      </Link>

      <Card.Body>
        <Link to={`/product/${_id}`}>
          <Card.Title as="div">
            {" "}
            <strong>{name}</strong>{" "}
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating value={rating} text={`${numReviews} reviews`} />
        </Card.Text>

        <Card.Text as="h3">${price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
