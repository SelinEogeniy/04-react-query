import axios from "axios";
import { Movie } from "../types/movie";

export interface MovieSearchResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export const fetchMovies = async (
  query: string
): Promise<MovieSearchResponse> => {
  const response = await axiosInstance.get<MovieSearchResponse>(
    "/search/movie",
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page: 1,
      },
    }
  );

  return response.data;
};
