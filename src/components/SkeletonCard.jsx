import './SkeletonCard.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-info">
        <div className="skeleton-line shimmer short"></div>
        <div className="skeleton-line shimmer"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
