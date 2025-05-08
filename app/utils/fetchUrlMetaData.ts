import axios from "axios";
import * as cheerio from "cheerio";

interface Metadata {
   title: string;
   description: string;
   image: string;
   duration?: string;
}

export const fetchMetadata = async (url: string): Promise<Metadata> => {
   try {
      const { data } = await axios.get<string>(url);
      const $ = cheerio.load(data);
      const title =
         $('meta[property="og:title"]').attr("content") || $("title").text() || "Unknown Title";
      const description =
         $('meta[property="og:description"]').attr("content") ||
         $('meta[name="description"]').attr("content") ||
         "No description available";
      const image = $('meta[property="og:image"]').attr("content") || "No image available";
      return { title, description, image };
   } catch (error) {
      return { title: "Unknown", description: "No description", image: "" };
   }
};
