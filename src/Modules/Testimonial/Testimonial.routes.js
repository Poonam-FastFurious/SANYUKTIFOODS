import { Router } from "express";
import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addTestimonial,
  deleteTestimonial,
  getAllTestimonials,
} from "./Testimonial.controler.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "photoUrl",
      maxCount: 1,
    },
  ]),
  addTestimonial
);
router.route("/alltestimonial").get(getAllTestimonials);
router.route("/delete").delete(deleteTestimonial);

export default router;
