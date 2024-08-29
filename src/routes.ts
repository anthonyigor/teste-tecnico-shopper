import { Router } from "express";
import { validateRequest } from "./middlewares/validateUploadRequest";
import { confirmSchema, getCustomerListSchema, uploadSchema } from "./utils/validators";
import { AppConfig } from "./config/AppConfig";
import { validateQuery } from "./middlewares/validateParamsRequest";

const router = Router();

// controllers
const uploadController = AppConfig.createUploadController();
const confirmController = AppConfig.createConfirmController();
const customerListController = AppConfig.createCustomerListController();

router.post("/upload", validateRequest(uploadSchema), (req, res) => uploadController.handle(req, res));
router.patch("/confirm", validateRequest(confirmSchema), (req, res) => confirmController.handle(req, res));
router.get("/:customer_code/list", validateQuery(getCustomerListSchema), (req, res) => customerListController.handle(req, res))

export default router;