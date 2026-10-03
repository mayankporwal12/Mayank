import { Router, type IRouter } from "express";
import aiRouter from "./ai";
import healthRouter from "./health";
import imagesRouter from "./images";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/ai", requireAuth);
router.use(aiRouter);
router.use(imagesRouter);

export default router;
