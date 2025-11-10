import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          협상 시뮬레이터
        </Link>

        <div className="navbar-menu">
          {currentUser ? (
            <>
              <Link to="/scenarios" className="navbar-link">
                시나리오
              </Link>
              <Link to="/history" className="navbar-link">
                내 기록
              </Link>
              <div className="navbar-user">
                <span className="user-name">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button onClick={handleLogout} className="logout-button">
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                로그인
              </Link>
              <Link to="/signup" className="navbar-link-primary">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
