import { Router } from "express";

import { upload } from "../../middlewares/FileUpload.middlwares.js";
import {
  addProduct,
  approveProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  searchProducts,
  updateProduct,
} from "./product.controler.js";
import { adminVerifyJWT } from "../../middlewares/adminVerifyJWT.js";

const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 10,
    },
  ]),
  addProduct
);
router.route("/products").get(getAllProducts);
router.route("/product").get(getSingleProduct);
router.route("/searchproduct").get(searchProducts);
router.route("/delete").delete(deleteProduct);
router.route("/Aprove").patch(approveProduct);
router.route("/update").patch(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 10,
    },
  ]),
  updateProduct
);

export default router;
