import { Router } from "express";
import {
  signin,
  signup,
  signupCustomer,
  signupDriver,
  signupRestaurant,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signup/customer", signupCustomer);
router.post("/signup/driver", signupDriver);
router.post("/signup/restaurant", signupRestaurant);

export default router;
