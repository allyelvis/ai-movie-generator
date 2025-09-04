import { GoogleGenAI, Type } from "@google/genai";
import type { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const movieSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The creative and fitting title of the movie.",
      },
      year: {
        type: Type.INTEGER,
        description: "The fictional release year of the movie."
      },
      synopsis: {
        type: Type.STRING,
        description: "A compelling and concise two-to-three sentence synopsis of the movie's plot."
      },
    },
    required: ["title", "year", "synopsis"],
  },
};


export const generateMoviePortfolio = async (theme: string): Promise<Movie[]> => {
  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const prompt = `Based on the theme "${theme}", generate a list of 6 interesting, fictional movies. Ensure the titles are creative and the synopses are compelling.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: movieSchema,
        },
      });

      const responseText = response.text.trim();
      const parsedMovies = JSON.parse(responseText) as Omit<Movie, 'isPremium'>[];
      
      const moviesWithPremium = parsedMovies.map(movie => ({ ...movie, isPremium: false }));
      if (moviesWithPremium.length > 0) {
          const premiumIndex = Math.floor(Math.random() * moviesWithPremium.length);
          moviesWithPremium[premiumIndex].isPremium = true;
      }

      return moviesWithPremium;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error("Error calling Gemini API after multiple retries:", error);
        throw new Error("Failed to fetch movie portfolio from Gemini API.");
      }
      console.log(`API call for movie portfolio failed. Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2; // Exponential backoff
    }
  }
  // This line is unreachable but required for TypeScript's control flow analysis.
  throw new Error("Failed to fetch movie portfolio from Gemini API.");
};

export const generateAccessKeyImage = async (title: string, synopsis: string): Promise<string> => {
  let retries = 3;
  let delay = 1000;

  while(retries > 0) {
    try {
      const prompt = `Create a visually striking digital access key for a movie called '${title}'. The key should look like a high-tech, cryptographic certificate on a futuristic interface. Incorporate glowing neon green circuit patterns, holographic elements, and a sleek, dark background. The movie's theme is: '${synopsis}'. The image should be symbolic and abstract, and must not contain any readable text.`;
      
      const response = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '16:9',
          },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
      } else {
        throw new Error("Image generation failed to return an image.");
      }
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error("Error generating access key image after multiple retries:", error);
        throw new Error("Failed to generate access key image.");
      }
      console.log(`API call for access key image failed. Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2; // Exponential backoff
    }
  }
  // This line is unreachable but required for TypeScript's control flow analysis.
  throw new Error("Failed to generate access key image.");
};
