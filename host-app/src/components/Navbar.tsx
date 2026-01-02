import { Link, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#333",
        color: "#fff",
        gap: "20px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "5px 10px",
          cursor: "pointer",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        &#8592; Back
      </button>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/remote1" style={{ color: "white", textDecoration: "none" }}>
          Remote 1 (Button)
        </Link>
        <Link
          to="/remote2/cart"
          style={{ color: "white", textDecoration: "none" }}
        >
          Remote 2 (Cart)
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
