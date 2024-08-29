import { Router } from "express";
import { validateRequest } from "./middlewares/validateUploadRequest";
import { uploadSchema } from "./utils/validators";
import { UploadController } from "./controllers/UploadController";
import { AppConfig } from "./config/AppConfig";

const router = Router();

const uploadController = AppConfig.createUploadController();

router.post("/upload", validateRequest(uploadSchema), (req, res) => uploadController.handle(req, res));

export default router;