import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // TanStack Query для получения фильмов
  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query, // Запрос выполняется только если есть query
  });

  // Показываем toast если нет результатов
  useEffect(() => {
    if (data && data.results.length === 0 && query && !isLoading) {
      toast.error("No movies found for your request.");
    }
  }, [data, query, isLoading]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1); // Сбрасываем на первую страницу при новом поиске
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}

      <Toaster position="top-right" />
    </div>
  );
};

export default App;
