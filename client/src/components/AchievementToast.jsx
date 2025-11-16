import { useEffect } from 'react';
import './AchievementToast.css';

const AchievementToast = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="achievement-toast">
      <div className="achievement-shine" />
      <div className="achievement-content">
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-text">
          <div className="achievement-label">🏆 업적 달성!</div>
          <div className="achievement-title">{achievement.title}</div>
          <div className="achievement-description">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementToast;
