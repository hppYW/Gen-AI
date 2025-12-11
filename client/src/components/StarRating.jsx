import './StarRating.css';

const StarRating = ({ rating, showLabel = true, size = 'medium' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= rating ? 'filled' : 'empty'} ${size}`}
      >
        ⭐
      </span>
    );
  }

  const getRatingText = () => {
    if (rating === 5) return '완벽해요!';
    if (rating === 4) return '훌륭해요!';
    if (rating === 3) return '괜찮아요!';
    if (rating === 2) return '노력하세요!';
    return '다시 도전!';
  };

  return (
    <div className="star-rating-container">
      <div className="stars-display">{stars}</div>
      {showLabel && (
        <div className={`rating-label rating-${rating}`}>
          {getRatingText()}
        </div>
      )}
    </div>
  );
};

export default StarRating;
