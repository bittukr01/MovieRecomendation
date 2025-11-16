import SearchBar from "./Components/SearchBar";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "./Components/styles/HomeStyles.css";
import MovieCard from "./Components/MovieCard";
import { useEffect, useState } from "react";

const Home = () => {
    // const apiKey = "api_key=b97316ed479ee4226afefc88d1792909";
    const apiKey = "api_key=bb53258c171acd01bc452bacabfe7cd0";
    const [list, setList] = useState([]);
    const [homeGenreList, setHomeGenreList] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [currMovies, setCurrMovies] = useState([]);

    useEffect(() => {
        setCurrMovies([]);
        setSelectedGenres([]);
        setHomeGenreList([]);
        setList([]);

        // Fetching movies
        fetch("/api/movies").then((Response) =>
            Response.json().then((data) => setList(data.arr))
        );

        // Fetching all genres and filtering only required 
        fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
            .then((Response) => Response.json())
            .then((data) => {
                const allowedGenres = [
                    "Action",
                    "History",
                    "Comedy",
                    "Drama",
                    "Horror",
                    "Family",
                    "Mystery",
                    "Science Fiction",
                    "Thriller"
                ];

                const filtered = data.genres.filter((g) =>
                    allowedGenres.includes(g.name)
                );

                setHomeGenreList(filtered);
            });
    }, []);

    useEffect(() => {
        setCurrMovies([]);
        if (selectedGenres.length > 0) {
            fetch(
                `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&${apiKey}&release_date.lte=2019-12-12&with_genres=${encodeURI(
                    selectedGenres.join(",")
                )}`
            ).then((Response) =>
                Response.json().then((data) => setCurrMovies(data.results))
            );
        }
    }, [selectedGenres]);

    const onTagClick = (genreId) => {
        if (selectedGenres.includes(genreId)) {
            setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
        } else {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    };

    const renderMovies = () =>
        currMovies.map((movie) =>
            movie ? (
                <MovieCard
                    key={movie.id + movie.original_title}
                    movie={movie}
                />
            ) : null
        );

    return (
        <div className="container-fluid">
            <div className="HomePage">
                <NavBar isHome={false} />
                <div className="HomeSearch">
                    <SearchBar movies={list} placeholder="Search for a Movie" />
                </div>

                <h2 className="genreHeader">Movies Tailored to Your Taste</h2>

                <div className="buttonGrid">
                    {homeGenreList.map((genre) => (
                        <div
                            key={genre.id}
                            onClick={() => onTagClick(genre.id)}
                            className={
                                selectedGenres.includes(genre.id)
                                    ? "genreTagON"
                                    : "genreTagOFF"
                            }
                        >
                            {genre.name}
                            {selectedGenres.includes(genre.id) ? (
                                <i className="fa fa-times" aria-hidden="true"></i>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>

            <div className="container-fluid HomeMovies">
                <div className="container HomeMovieGrid">
                    {currMovies.length > 0 ? renderMovies() : null}
                </div>
            </div>

            <div className="HomeFooter">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
