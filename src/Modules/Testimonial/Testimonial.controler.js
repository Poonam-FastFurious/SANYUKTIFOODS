// controllers/testimonial.controller.js

import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/Cloudinary.js";
import { Testimonial } from "./Testimonial.modal.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const addTestimonial = asyncHandler(async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { name, message, rating, email } = req.body;

    if (![name, message, email].every((field) => field?.trim())) {
      throw new ApiError(400, "Name, message, and email are required");
    }

    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    // Check if photoUrl file is provided
    const imageLocalPath = req.files?.photoUrl?.[0]?.path;
    if (!imageLocalPath) {
      throw new Error("Photo file is required");
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    if (!uploadedImage) {
      throw new Error("Failed to upload photo");
    }

    const testimonial = await Testimonial.create({
      name,
      message,
      rating,
      email,
      photoUrl: uploadedImage.url, // Saving URL in photoUrl field of the model
    });

    return res.status(201).json({
      success: true,
      data: testimonial,
      message: "Testimonial added successfully",
    });
  } catch (error) {
    console.error("Error during testimonial addition:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();

    if (!testimonials || testimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No testimonials found",
      });
    }

    // Log testimonials to check if _id is present

    // Mapping testimonials to remove _id and converting to plain JS objects
    const formattedTestimonials = testimonials.map((testimonial) => {
      const { photoUrl, name, message, rating, email, date, _id, ...rest } =
        testimonial.toObject();
      return { photoUrl, name, message, rating, email, date, _id, ...rest };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formattedTestimonials,
          "Successfully retrieved testimonials"
        )
      );
  } catch (error) {
    console.error("Error while fetching testimonials:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.body;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      throw new ApiError(404, "Testimonial not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
  } catch (error) {
    console.error("Error during testimonial deletion:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export { addTestimonial, getAllTestimonials, deleteTestimonial };
