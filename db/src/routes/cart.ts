import express, { Request, Response } from "express";
import Cart from "../database/schema/cart-schema";
import { Card } from "../database/model/Card";
import { auth } from "../service/auth-service";
import { validateToken } from "../middleware/validate-token";
import { ICart, ICartItem } from "../@types/cart";
import mongoose from "mongoose";
import winston from "winston";
import CartModel from "../database/schema/cart-schema";

const router = express.Router();

const Logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logfile.log" }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
});

router.get("/", validateToken, async (req: Request, res: Response) => {
  const owner = req.user?._id?.toString(); 

  try {
    const cart = await Cart.aggregate([
      {
        $match: { owner },
      },
      {
        $lookup: {
          from: "cards",
          localField: "savedItems",
          foreignField: "_id",
          as: "savedForLaterItems",
        },
      },
    ]);

    if (cart && cart.length > 0) {
      res.status(200).send(cart);
    } else {
      res.send(null);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post("/:cardId", validateToken, async (req: Request, res: Response) => {
  const owner = req.user?._id?.toString(); 
  const { cardId } = req.params;
  const quantity = parseInt(req.body.quantity);

  try {
    const cart = await Cart.findOne({ owner });
    const card = await Card.findOne({ _id: cardId });

    if (!card) {
      res.status(404).send({ message: "Card not found" });
      return;
    }

    const price = card.price;
    const name = card.title;
    const images = card.images;
    const brand = card.brand;
    const shipping = card.shipping;

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.cardId.toString() === cardId
      );

      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;
      } else {
        cart.items.push({
          cardId,
          name,
          quantity,
          price,
          images,
          brand,
          shipping,
        });
      }

      cart.bill = cart.items.reduce(
        (acc, curr) => acc + Number(curr.quantity) * curr.price,
        0
      );
      await cart.save();
      res.status(200).send(cart);
    } else {
      const newCart = await Cart.create({
        _id: new mongoose.Types.ObjectId(), 
        owner,
        items: [{ cardId, name, quantity, price, images, brand, shipping }],
        bill: quantity * price,
      });
      res.status(201).send(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

router.delete("/:_id", validateToken, async (req: Request, res: Response) => {
  const _id = req.params._id; 

  try {
    const cart = await Cart.findById(_id);

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = [];

    cart.bill = 0;

    await cart.save();

    res.status(200).send("Cart emptied successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

router.delete(
  "/item/:itemId",
  validateToken,
  async (req: Request, res: Response) => {
    const owner = req.user?._id.toString();
    const { itemId } = req.params;

    try {
      const cart = await Cart.findOne({ owner });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id && item._id.toString() === itemId
      );
      if (itemIndex === -1) {
        return res.status(404).send({ message: "Item not found in cart" });
      }

      cart.items.splice(itemIndex, 1);
      cart.bill = cart.items.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0
      );
      await cart.save();
      res.status(200).send(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.put(
  "/item/:itemId",
  validateToken,
  async (req: Request, res: Response) => {
    const owner = req.user?._id.toString();
    const { itemId } = req.params;
    const { newQuantity } = req.body; 

    if (isNaN(newQuantity) || newQuantity < 1) {
      return res.status(400).send({ message: "Invalid quantity provided" });
    }

    try {
      const cart = await Cart.findOne({ owner });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id && item._id.toString() === itemId
      );

      if (itemIndex === -1) {
        return res.status(404).send({ message: "Item not found in cart" });
      }

      cart.items[itemIndex].quantity = newQuantity;

      cart.bill = cart.items.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0
      );

      await cart.save();
      res.status(200).send(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.get(
  "/savedForLater",
  validateToken,
  async (req: Request, res: Response) => {
    const owner = req.user?._id?.toString(); 

    try {
      const cart = await Cart.findOne({ owner });

      if (cart && cart.savedForLaterItems.length > 0) {
        res.status(200).send(cart.savedForLaterItems);
      } else {
        res.send([]);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

router.post(
  "/item/:itemId/saveForLater",
  validateToken,
  async (req: Request, res: Response) => {
    const owner = req.user?._id.toString();
    const { itemId } = req.params;

    try {
      const cart = await Cart.findOne({ owner });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id && item._id.toString() === itemId
      );

      if (itemIndex === -1) {
        return res.status(404).send({ message: "Item not found in cart" });
      }

      const [savedItem] = cart.items.splice(itemIndex, 1);

      cart.savedForLaterItems.push(savedItem);

      await cart.save();

      res.status(200).send(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.post(
  "/item/:itemId/moveToCart",
  validateToken,
  async (req: Request, res: Response) => {
    const owner = req.user?._id.toString();
    const { itemId } = req.params;

    try {
      const cart = await Cart.findOne({ owner });
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      const itemIndex = cart.savedForLaterItems.findIndex(
        (item) => item._id && item._id.toString() === itemId
      );

      if (itemIndex === -1) {
        return res
          .status(404)
          .send({ message: "Item not found in saved items" });
      }

      const itemToMoveBack = cart.savedForLaterItems.splice(itemIndex, 1)[0];
      cart.items.push(itemToMoveBack);

      await cart.save();
      res.status(200).send(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/savedItem/:itemId",
  validateToken,
  async (req: Request, res: Response) => {
    const owner = req.user?._id.toString();
    const { itemId } = req.params;

    try {
      const cart = await Cart.findOneAndUpdate(
        { owner },
        { $pull: { savedForLaterItems: { _id: itemId } } },
        { new: true }
      );

      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }

      res.status(200).send(cart);
    } catch (error) {
      console.error("Error deleting saved item:", error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

router.get("/cart/:userId", validateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await CartModel.findOne({ owner: userId }).populate(
      "items.cardId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart.items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

router.get("/carts", validateToken, async (req, res) => {
  try {
    const carts = await CartModel.find().populate("items.cardId");
    res.json(carts);
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ message: "Failed to fetch carts" });
  }
});

router.get("/cart/items", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.status(200).json({ items: cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

router.delete("/:itemId", validateToken, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const owner = req.user?._id?.toString(); 

    if (!owner) {
      Logger.error("User ID not found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ owner });
    if (!cart) {
      Logger.error(`Cart not found for user: ${owner}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    const savedItemIndex = cart.savedForLaterItems.findIndex(
      (item) => item._id?.toString() === itemId 
    );
    if (savedItemIndex === -1) {
      Logger.error(`Saved item not found in cart: ${itemId}`);
      return res.status(404).json({ message: "Saved item not found in cart" });
    }

    const deletedSavedItem = cart.savedForLaterItems.splice(
      savedItemIndex,
      1
    )[0];
    await cart.save();

    Logger.info(`Saved item deleted successfully: ${itemId}`);
    res.json({ message: "Saved item deleted successfully", deletedSavedItem });
  } catch (error) {
    Logger.error(`Error deleting saved item: ${(error as Error).message}`);
    next(error);
  }
});




export default router;

export { router as cartRouter };
