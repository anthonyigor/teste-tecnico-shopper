import { Router } from "express";
import { validateRequest } from "./middlewares/validateUploadRequest";
import { uploadSchema } from "./utils/validators";
import { UploadController } from "./controllers/UploadController";

const router = Router();

const uploadController = new UploadController();

router.post("/upload", validateRequest(uploadSchema), uploadController.handle);

export default router;