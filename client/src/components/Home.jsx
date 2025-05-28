import './Home.css';

const Home = ({ user, onLogout }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to K.R. Mangalam University Portal</h1>
      </header>

      <main className="dashboard-main">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2>User Profile</h2>
          </div>
          
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user.name || 'Not available'}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email || 'Not available'}</span>
            </div>
            
            {user.jobTitle && (
              <div className="info-item">
                <span className="info-label">Title:</span>
                <span className="info-value">{user.jobTitle}</span>
              </div>
            )}
            
            {user.department && (
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{user.department}</span>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={onLogout}
            className="logout-button"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;