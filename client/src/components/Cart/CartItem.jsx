import {
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { removeCart } from "../../redux/actions/index";

function CartItem({ title, img, price, id }) {
  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(removeCart(id));
  };

  return (
    <div>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar alt={title} src={img} />
        </ListItemAvatar>
        <ListItemText
          primary={
            title
              ? title.length > 25
                ? `${title.substring(0, 25)}...`
                : title
              : null
          }
          secondary={price ? `$${price}` : null}
        />
      </ListItem>
    </div>
  );
}

export default CartItem;
