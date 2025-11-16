import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          협상 시뮬레이터
        </Link>

        <div className="navbar-menu">
          <Link to="/guide" className="navbar-link">
            📚 협상 가이드
          </Link>
          <Link to="/scenarios" className="navbar-link">
            시나리오
          </Link>
          <Link to="/history" className="navbar-link">
            내 기록
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
