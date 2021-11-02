import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { deleteFavs, addFavs } from "../../utils/favs";
import { getUserInfo } from "../../redux/actions/index";
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

export default function DetailService({ id }) {
  let [service, setService] = useState({ service: {}, user: {} });
  const [favState, setFavState] = useState(false);
  const cookie = useSelector((state) => state.cookie);
  const favs = useSelector((state) => state.favs);
  const dispatch = useDispatch();

  let history = useHistory();
  function updateService() {
    axios(`http://localhost:3001/services/${id}`).then((response) => {
      console.log("respuestaEnDetail", response);
      setService({ ...service, ...response.data });
    });
  }
  useEffect(() => {
    if (cookie) {
      if (favs) {
        const index = favs.findIndex((f) => f.serviceId === id);
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
  }, []);

  const theme = {
    favorite: {
      1: { color: "red" },
      0: { color: "grey" },
    },
  };

  const handleClose = () => {
    history.goBack();
  };

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

  const IMG_TEMPLATE =
    "https://codyhouse.co/demo/squeezebox-portfolio-template/img/img.png";

  let { img, title, price, description, rating, qualifications } =
    service.service;

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gap={2}
      p={2}
      border="solid 1px lightgrey"
      maxWidth="80%"
      m="auto"
    >
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
        />
      </Box>

      <Box gridColumn="span 4" m={2} p={2} border="solid 1px lightgrey">
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
                cookie && cookie.split("=")[1] !== service.userId
                  ? {}
                  : { display: "none" }
              }
            >
              <Favorite color={favState ? "error" : ""} />
            </IconButton>
            <IconButton aria-label="share">
              <Share />
            </IconButton>
          </Box>

          <Box gridColumn="span 6">
            <IconButton onClick={() => handleClose()}>
              <Close />
            </IconButton>
          </Box>
        </Box>

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
          <Rating
            name="read-only"
            value={Number(rating)}
            precision={0.5}
            readOnly
            sx={{}}
          />
          {qualifications
            ? `${qualifications.length} opiniones`
            : "0 opiniones"}
        </Box>

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
              onClick={() => {}}
              color={!false ? "primary" : "success"}
              aria-label="add to shopping cart"
              sx={{}}
            >
              <AddShoppingCart />
            </IconButton>
          </CardActions>
        </Box>

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
        <Box gridColumn="span 12">
          <CardUser user={service.user} />
        </Box>
      </Box>
    </Box>
  );
}
