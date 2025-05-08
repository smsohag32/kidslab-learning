import { Request, Response } from "express";
import Video from "../models/Video";
import { fetchMetadata } from "../utils/fetchUrlMetaData";

export const createVideo = async (req: Request, res: Response): Promise<void> => {
   try {
      const {
         url,
         category,
         publicationDate,
         isApproved = true,
         addedBy = "Sohag Sheik",
         status,
      } = req.body;

      if (!url) {
         res.status(400).json({ message: "URL is required." });
         return;
      }

      const metadata = await fetchMetadata(url);

      const newVideo = new Video({
         url,
         title: metadata.title || "",
         publicationDate,
         description: metadata.description || "",
         duration: "",
         image: metadata.image || "",
         category,
         isApproved,
         addedBy,
         status,
      });

      await newVideo.save();
      res.status(201).json(newVideo);
   } catch (error: any) {
      console.error("Error creating video:", error);

      if (error.code === 11000) {
         res.status(400).json({ message: "URL already exists." });
         return;
      }

      res.status(500).json({ message: "Internal server error." });
   }
};

export const getAllVideos = async (req: Request, res: Response): Promise<void> => {
   try {
      const {
         page = 1,
         limit = "10",
         category,
         search,
      } = req.query as {
         page?: string;
         limit?: string;
         category?: string;
         search?: string;
      };

      const query: any = { status: true, isApproved: true };

      if (category) {
         query.category = category;
      }

      if (search) {
         query.title = { $regex: search, $options: "i" };
      }

      const skip = (parseInt(page.toString()) - 1) * parseInt(limit);
      const videos = await Video.find(query).skip(skip).limit(parseInt(limit));
      const total = await Video.countDocuments(query);

      res.status(200).json({
         data: videos,
         total,
         page: parseInt(page.toString()),
         limit: parseInt(limit.toString()),
      });
   } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};

export const getAllVideoAdmin = async (req: Request, res: Response): Promise<void> => {
   try {
      const videos = await Video.find({ isApproved: true });
      res.status(200).json(videos);
   } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;

      const video = await Video.findById(id).populate("addedBy");
      if (!video) {
         res.status(404).json({ message: "Video not found." });
         return;
      }

      res.status(200).json(video);
   } catch (error) {
      console.error("Error fetching video by ID:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const updates = req.body;

      const video = await Video.findByIdAndUpdate(id, updates, { new: true });
      if (!video) {
         res.status(404).json({ message: "Video not found." });
         return;
      }

      res.status(200).json(video);
   } catch (error) {
      console.error("Error updating video:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;

      const video = await Video.findByIdAndDelete(id);
      if (!video) {
         res.status(404).json({ message: "Video not found." });
         return;
      }

      res.status(200).json({ message: "Video deleted successfully." });
   } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};

export const changeVideoStatus = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      if (typeof status !== "boolean") {
         res.status(400).json({ message: "Invalid status value. Status must be a boolean." });
         return;
      }

      const video = await Video.findById(id);
      if (!video) {
         res.status(404).json({ message: "Video not found." });
         return;
      }

      video.status = status;
      await video.save();

      res.status(200).json({ message: "Video status updated successfully.", video });
   } catch (error) {
      console.error("Error changing video status:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};

export const approveVideo = async (req: Request, res: Response): Promise<void> => {
   try {
      const { id } = req.params;

      const video = await Video.findById(id);
      if (!video) {
         res.status(404).json({ message: "Video not found." });
         return;
      }

      video.isApproved = true;
      await video.save();

      res.status(200).json({ message: "Video approved successfully.", video });
   } catch (error) {
      console.error("Error approving video:", error);
      res.status(500).json({ message: "Internal server error." });
   }
};
