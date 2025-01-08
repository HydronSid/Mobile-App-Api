import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./homepage/HomePage.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const [books, setBooks] = useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchBooks = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/v1/books");
//       console.log(response.data);

//       setBooks(response.data);
//     } catch (err) {
//       console.log(err);

//       setError("Failed to fetch books.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchBooks();
// }, []);

// if (loading) return <div>Loading...</div>;
// if (error) return <div>{error}</div>;
