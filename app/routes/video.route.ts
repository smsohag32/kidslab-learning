import express from "express";
import {
   createVideo,
   getAllVideos,
   getAllVideoAdmin,
   getVideoById,
   updateVideo,
   deleteVideo,
   changeVideoStatus,
   approveVideo,
} from "../controllers/video.controller";

const router = express.Router();

// Create a new video
router.post("/videos", createVideo);

router.get("/videos", getAllVideos);

// Get all approved videos (admin)
router.get("/videos/admin", getAllVideoAdmin);

// Get a specific video by ID
router.get("/videos/:id", getVideoById);

// Update a specific video by ID
router.put("/videos/:id", updateVideo);

// Delete a specific video by ID
router.delete("/videos/:id", deleteVideo);

// Change the status (active/inactive) of a video
router.put("/videos/:id/status", changeVideoStatus);

// Approve a specific video (admin)
router.put("/videos/:id/approve", approveVideo);

export default router;
