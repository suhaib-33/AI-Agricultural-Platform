import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span>Chitrals Dry</span>
        </Link>

        <nav>
          <Link
            className={location.pathname === "/" ? "nav-link active" : "nav-link"}
            to="/"
          >
            Home
          </Link>
          <Link
            className={
              location.pathname === "/create-batch"
                ? "nav-link active"
                : "nav-link"
            }
            to="/create-batch"
          >
            Grade a Batch
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;