import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import LazyLoader from "./components/Loader/lazyLoader";

// Lazy load the Home component
const Home = lazy(() => import("../src/home"));

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<LazyLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Uncomment and add more routes as needed */}
              {/* <Route path="/progress" element={<Progressbar />} /> */}
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
