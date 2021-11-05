import React, { useEffect } from "react";
import Product from "../components/Product";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Paginate from "../components/Paginate";

const HomePage = ({ match }) => {
  const keyWord = match.params.keyword
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page, keyword } = productList;

  useEffect(() => {
    dispatch(listProducts(keyWord, pageNumber));
  }, [dispatch, pageNumber, keyWord])

  return (
    <>
      <h1>Latest products</h1>
      {loading ? (<Loader />) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product {...product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={pages} page={page} keyword={keyword} />
        </>
      )}
    </>
  );
};

export default HomePage;
