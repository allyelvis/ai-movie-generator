
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
    const parsedMovies = JSON.parse(responseText) as Movie[];
    return parsedMovies;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch movie portfolio from Gemini API.");
  }
};
