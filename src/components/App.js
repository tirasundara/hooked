import React, { useReducer, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const BASE_API_URL = "https://www.omdbapi.com/";
const API_KEY = "4a3b711b";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SERACH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispacth] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(`${BASE_API_URL}?s=man&apikey=${API_KEY}`)
      .then(response => response.json())
      .then(json =>
        dispacth({ type: "SEARCH_MOVIES_SUCCESS", payload: json.Search })
      );
  }, []);

  const search = searchValue => {
    dispacth({ type: "SERACH_MOVIES_REQUEST" });

    fetch(`${BASE_API_URL}/?s=${searchValue}&apikey=${API_KEY}`)
      .then(resonse => resonse.json())
      .then(json => {
        if (json.Response === "True") {
          dispacth({ type: "SEARCH_MOVIES_SUCCESS", payload: json.Search });
        } else {
          dispacth({ type: "SEARCH_MOVIES_FAILURE", error: json.Error });
        }
      });
  };

  const { loading, movies, errorMessage } = state;

  return (
    <div className="App">
      <Header className="App-header" text="HOOKED" />
      <Search search={search} />
      <div className="movies">
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie movie={movie} key={`${index}-${movie.Title}`} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
