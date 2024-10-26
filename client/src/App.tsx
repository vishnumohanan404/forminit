import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/about">
            <div></div>{" "}
          </Route>
          <Route path="/">
            <></>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
