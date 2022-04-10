import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart,{generateCartItemsFrom} from "./Cart"

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

// const dummy={
// "name":"Tan Leatherette Weekender Duffle",
// "category":"Fashion",
// "cost":150,
// "rating":4,
// "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
// "_id":"PmInA797xJhMIPti"
// }
const Products = () => {

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  const { enqueueSnackbar } = useSnackbar();
  const [productArray, setProductArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchValid, setSearchValid] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartData,setCartData]=useState("");
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    let URL = `${config.endpoint}/products`;
    if (searchKey !== "") {
      URL = URL + `/search?value=${searchKey}`
    }
    try {
      setIsLoading(true);
      const response = await axios.get(`${URL}`);
      setIsLoading(false);
      // console.log(response.data);
      const data = response.data;
      // console.log(data);
      setProductArray(data);
    }
    catch (error) {
      setIsLoading(true);
      setSearchValid(true);
      // console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    performAPICall();
  }, [searchKey])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setSearchKey(text.target.value);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout !== 0) {
      clearTimeout(debounceTimeout);
    }
    const newTimeOut = setTimeout(() => performSearch(event), 500);
    setDebounceTimeout(newTimeOut);

  };
  const onChangeHandler = (e) => {
    debounceSearch(e, debounceTimeout);
  }
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    const URL= `${config.endpoint}/cart`;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response=await axios.get(URL,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      const data=response.data;
      setCartData(data);
      // console.log(data);

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
      for(let i=0;i<items.length;i++){
        if(productId===items[i]["productId"]){
          enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{ variant: 'warning'});
          return true;
        }
      }
      return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
      if(!token){
        enqueueSnackbar("Login to add an item to the Cart",{ variant: 'warning'});
        return;
      }
      if(!isItemInCart(items,productId)){
        // console.log(items);
        // console.log(token);
        // console.log(products);
        // console.log(qty);
        const URL=`${config.endpoint}/cart`;
        let postData={
          "productId":productId,
          "qty":qty
        }
       try{
        const response=await axios.post(URL,postData,{
          headers:{
            'Authorization': `Bearer ${token}`
          }
        });
        const data=response.data;
        setCartData(data);
       }catch(e){
         if(e.response&&e.response.status===400){
           console.log(e);
           return enqueueSnackbar(e.response.message,{variant:'error'});
         }
       }

      }
  };
  useEffect(()=>{
    const onLoader=()=>{
      fetchCart(localStorage.getItem("token"));
    }
    onLoader();
  },[]);
  let mountGrid = <Grid container spacing={2}>
    {
      productArray.map((product) => (
        <Grid item xs={6} md={3} className="product-grid" key={product._id}>
          <ProductCard product={product} handleAddToCart={()=>addToCart(
            localStorage.getItem('token'),
            cartData,
            productArray,
            product._id,
            1
          )}/>
        </Grid>
      ))
    }
  </Grid>

  let cardGrid = searchValid ? <Box className="loading">
    <SentimentDissatisfied />
    <p>No products found</p>
  </Box>
    : mountGrid;

  if (!localStorage.getItem('token')) {
    return (
      <div>
        <Header hasHiddenAuthButtons={true}>
          {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
          <TextField
            className="search-desktop"
            size="small"
            color="primary"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={onChangeHandler}
          />

        </Header>

        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={onChangeHandler}
        />
        <Grid container>
          <Grid item className="product-grid" >
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
            </Box>
            <Grid>
              {isLoading ? <Box direction="row" className="loading">
                <p>Loading Products</p> <CircularProgress color="inherit" />
              </Box> : cardGrid}
            </Grid>
          </Grid>
        </Grid>
        <Footer />
      </div>
    );
  } else {
    return (
      <div>
        <Grid container spacing={1}>
          <Grid item md={9}>
            <Header hasHiddenAuthButtons={true}>
              {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
              <TextField
                className="search-desktop"
                size="small"
                color="primary"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Search for items/categories"
                name="search"
                onChange={onChangeHandler}
              />

            </Header>

            <TextField
              className="search-mobile"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search for items/categories"
              name="search"
              onChange={onChangeHandler}
            />
            <Grid container>
              <Grid item className="product-grid" >
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                 to your door step
               </p>
                </Box>
                <Grid>
                  {isLoading ? <Box direction="row" className="loading">
                    <p>Loading Products</p> <CircularProgress color="inherit" />
                  </Box> : cardGrid}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} className="cart-grid">
            <Cart items={generateCartItemsFrom(cartData,productArray)} handleQuantity={setCartData}/>
          </Grid>
        </Grid>
        <Footer />
      </div>
    );
  }
};

export default Products;
