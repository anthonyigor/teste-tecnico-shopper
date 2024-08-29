import { Router } from "express";
import { validateRequest } from "./middlewares/validateUploadRequest";
import { confirmSchema, uploadSchema } from "./utils/validators";
import { AppConfig } from "./config/AppConfig";

const router = Router();

const uploadController = AppConfig.createUploadController();
const confirmController = AppConfig.createConfirmController();

router.post("/upload", validateRequest(uploadSchema), (req, res) => uploadController.handle(req, res));
router.patch("/confirm", validateRequest(confirmSchema), (req, res) => confirmController.handle(req, res));

export default router;