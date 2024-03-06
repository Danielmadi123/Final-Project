import { Router } from "express";
import { isBusiness } from "../middleware/is-business";
import { isAdmin } from "../middleware/is-admin";
import { validateCard } from "../middleware/validation";
import { createCard } from "../service/card-service";
import { ICardInput } from "../@types/card";
import { BizCardsError } from "../error/biz-cards-error";
import { Card } from "../database/model/Card";
import { Logger } from "../logs/logger";
import { validateToken } from "../middleware/validate-token";
import { isAdminOrUser } from "../middleware/is-admin-or-user";

const router = Router();

router.post(
  "/",
  validateToken,
  (req, res, next) => {
    if (req.user?.isBusiness || req.user?.isAdmin) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  },
  validateCard,
  async (req, res, next) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new BizCardsError("User must have an ID", 500);
      }

      const savedCard = await createCard(req.body as ICardInput, userId);

      res.json({ card: savedCard });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/", async (req, res, next) => {
  try {
    const { brand } = req.query as { brand?: string };
    let query = {};
    if (brand) {
      query = { brand };
    }
    const cards = await Card.find(query);
    return res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get(
  "/my-cards",
  validateToken,
  (req, res, next) => {
    if (req.user?.isBusiness || req.user?.isAdmin) {
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  },
  async (req, res, next) => {
    try {
      const userId = req.user?._id;

      console.log("User ID:", userId);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const cards = await Card.find({ userId });

      console.log("User Cards:", cards);

      return res.json(cards);
    } catch (e) {
      console.error("Error fetching user cards:", e);
      next(e);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);
    return res.json(card);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      console.error("Card not found:", id);
      return res.status(404).json({ message: "Card not found" });
    }
    if (
      !req.user ||
      (!req.user.isAdmin &&
        card.userId?.toString() !== req.user._id?.toString() &&
        !(
          req.user.isBusiness &&
          card.userId?.toString() === req.user._id?.toString()
        ))
    ) {
      Logger.warn(
        `User ${
          req.user ? req.user._id : "undefined"
        } tried to delete a card they did not create`
      );
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this card" });
    }

    const deletedCard = await Card.findByIdAndDelete(id);
    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    Logger.verbose(`Card deleted successfully: ${id}`);
    res.json({ message: "Card deleted successfully", deletedCard });
  } catch (error) {
    console.error(`Error deleting card: ${(error as Error).message}`);
    next(error);
  }
});

router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const userId = req.user?._id!;

    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    card.likes = card.likes || [];
    if (userId) {
      if (card.likes.includes(userId)) {
        card.likes = card.likes.filter((id) => id != userId && id != null);
        await card.save();
        return res.status(200).json({
          message: `Card ${cardId} un-liked by the user`,
          card,
        });
      }
    }
    card.likes.push(userId);
    await card.save();

    return res.status(200).json({
      message: `Card ${cardId} liked by the user`,
      card,
    });
  } catch (error) {
    Logger.error(`Error updating card: ${(error as Error).message}`);
    next(error);
  }
});

router.put("/:id", validateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await Card.findById(id);

    if (!card) {
      console.error("Card not found:", id);
      return res.status(404).json({ message: "Card not found" });
    }


    if (
      !req.user ||
      (!req.user.isAdmin &&
        card.userId?.toString() !== req.user._id?.toString() &&
        !(
          req.user.isBusiness &&
          card.userId?.toString() === req.user._id?.toString()
        ))
    ) {
      console.warn(`User ${req.user?._id} is not authorized to edit this card`);
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this card" });
    }

    card.set(req.body);
    const updatedCard = await card.save();
    console.log(`Card updated successfully: ${id}`);
    res.json(updatedCard);
  } catch (error) {
    console.error(`Error updating card: ${(error as Error).message}`);
    next(error);
  }
});



export { router as cardsRouter };
