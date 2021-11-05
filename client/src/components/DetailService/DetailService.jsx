import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { deleteFavs, addFavs } from "../../utils/favs";
import { getUserInfo, addCart } from "../../redux/actions/index";
// import { handleFav } from "../../utils/buttonHandlers";
import {
  Box,
  CardMedia,
  Typography,
  Rating,
  CardActions,
  IconButton,
} from "@mui/material";
import { AddShoppingCart, Favorite, Share, Close } from "@mui/icons-material";
import CardUser from "../CardUser/CardUser";
import Comments from "../Comments/Comments";
import RelatedServices from "./RelatedServices/RelatedServices";

export default function DetailService({ id, closeModal }) {
  let [service, setService] = useState({ service: {}, user: {} });
  const [favState, setFavState] = useState(false);
  const [added, setAdded] = useState(false);

  // ---------------- SERVICIOS RELACIONADOS -------------
  const [category, setCategory] = useState();
  const [related, setRelated] = useState([]);
  // --------------------------------

  const cart = useSelector((state) => state.cart);
  const cookie = useSelector((state) => state.cookie);
  const favs = useSelector((state) => state.user.servicesFavs);
  const dispatch = useDispatch();

  let history = useHistory();

  function updateService() {
    axios(`/services/${id}`).then((response) => {
      // console.log("respuestaEnDetail", response);
      setService({ ...service, ...response.data });
      setCategory(response.data.service.category.name);
    });
  }

  useEffect(() => {
    if (cookie) {
      if (favs) {
        const index = favs.findIndex((f) => f.id === Number(id));
        if (index === -1) {
          setFavState(() => false);
        } else {
          setFavState(() => true);
        }
      }
    }
  }, [favs, cookie, id]);

  //componentDidMount para traer la información del servicio por id
  useEffect(() => {
    updateService();
    // eslint-disable-next-line
  }, [id]);

  //----------- SERVICIOS RELACIONADOS ------------------------
  const getRelatedServices = useCallback(() => {
    axios(`/services?category=${category}`).then((response) => {
      let NumberId = Number(id)
      setRelated(response.data.filter(s => s.id !== NumberId).slice(0,4));
    });
  }, [category, id]);

  // function getRelatedServices() {
  // }

  useEffect(() => {
    if (category) {
      getRelatedServices();
    }
  }, [category, getRelatedServices, id]);
  //-------------------------------------------------------

  // para agregarlo o sacarlo del carrito
  useEffect(() => {
    const index = cart.findIndex((s) => s.id === id);
    if (index === -1) {
      setAdded(() => false);
    } else {
      setAdded(() => true);
    }
  }, [cart, id]);

  // onClick del carrito
  const handleClick = () => {
    if (!added) {
      const service = {
        title,
        img,
        price,
        id,
      };
      dispatch(addCart(service));
      setAdded(() => true);
    }
  };

  // const theme = {
  //   favorite: {
  //     1: { color: "red" },
  //     0: { color: "grey" },
  //   },
  // };

  const handleClose = () => {
    history.push("/home");
  };

  //-------------------HANDLE FAVS-------------------------
  const handleFavs = async () => {
    try {
      if (cookie) {
        if (favState) {
          await deleteFavs(Number(id));
          setFavState(() => false);
          dispatch(await getUserInfo());
        } else {
          await addFavs(Number(id));
          setFavState(() => true);
          dispatch(await getUserInfo());
        }
      }
    } catch (e) {
      console.log(e.response.data);
    }
  };
  //-----------------------------------------

  const IMG_TEMPLATE =
    "https://codyhouse.co/demo/squeezebox-portfolio-template/img/img.png";

  let { img, title, price, description, rating, qualifications } =
    service.service;

  return (
    <>
      {/* <Nav /> */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={2}
        p={2}
        maxWidth="80%"
        m="0px auto"
      >
        {/* ----------------- FOTO Y COMENTARIOS ------------------------- */}
        <Box gridColumn="span 8" p={2}>
          <CardMedia
            component="img"
            image={img ? img : IMG_TEMPLATE}
            height="400"
            alt={id}
            sx={{ objectFit: "cover" }}
          />

          <Comments
            updateService={updateService}
            serviceId={id}
            qualifications={qualifications}
            cookie={cookie}
          />
        </Box>
        {/* ----------------------------------------------------- */}

        {/* ---------------------- BARRA LATERAL DERECHA ------------------- */}
        <Box gridColumn="span 4" m={2} p={2} border="solid 1px lightgrey">
          {/* ---- BOTONES FAV SHARE CLOSE---------------------- */}
          <Box
            gridColumn="span 12"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box gridColumn="span 6">
              <IconButton
                onClick={handleFavs}
                aria-label="add to favorites"
                sx={
                  cookie && cookie !== service.userId ? {} : { display: "none" }
                }
              >
                <Favorite color={favState ? "error" : ""} />
              </IconButton>
              <IconButton aria-label="share">
                <Share />
              </IconButton>
            </Box>

            <Box gridColumn="span 6">
              {/* () => handleClose() */}
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          {/* -------------------------------------- */}

          {/* -----------TITLE QUALIFICATION--------------------- */}
          <Box
            gridColumn="span 12"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            alignContent="start"
          >
            <Typography variant="h5" sx={{ width: "100%", textAlign: "left" }}>
              {" "}
              {title}{" "}
            </Typography>
          </Box>
          <Box
            gridColumn="span 12"
            display="flex"
            flexDirection="row"
            justifyContent="left"
          >
            <Rating
              name="read-only"
              value={Number(rating)}
              precision={0.5}
              readOnly
              sx={{}}
            />
            <Typography variant="subtitle 1" sx={{ ml: "10px" }}>
              {qualifications
                ? qualifications.length === 1
                  ? ` ${qualifications.length} opinion`
                  : ` ${qualifications.length} opinions`
                : "0 opiniones"}
            </Typography>
          </Box>
          {/* -------------------------------------------- */}

          {/* -------------- PRICE - CART ------------------------ */}
          <Box
            gridColumn="span 12"
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            alignContent="start"
          >
            <CardActions disableSpacing>
              <Typography variant="h5" sx={{}}>
                {" "}
                {`$${price ? price : 0}`}{" "}
              </Typography>
              <IconButton
                onClick={handleClick}
                color={!added ? "primary" : "success"}
                aria-label="add to shopping cart"
                sx={{ ml: "auto" }}
              >
                <AddShoppingCart />
              </IconButton>
            </CardActions>
          </Box>
          {/* ---------------------------------------- */}

          {/* -------------- DESCRIPTION ----------- */}
          <Box gridColumn="span 12">
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ textAlign: "left" }}
            >
              {" "}
              Description:{" "}
            </Typography>
            <Typography
              variant="subtitle2"
              component="div"
              sx={{ textAlign: "left" }}
            >
              {" "}
              {description}{" "}
            </Typography>
          </Box>
          {/* ------------------------------------------- */}

          {/* ---------- USER CARD -------------------- */}
          <Box gridColumn="span 12">
            <CardUser user={service.user} />
          </Box>
          {/* -------------------------------------- */}
        </Box>
      </Box>

      {related && <RelatedServices related={related} />}
    </>
  );
}
