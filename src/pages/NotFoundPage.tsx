import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import '../styles/pages/ContentPages.scss';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="content-page not-found-page animate-fade-in">
      <div className="container text-center not-found-content">
        <span className="error-code">404</span>
        <h1 className="not-found-title">Silhouette Not Found</h1>
        <p className="not-found-lead">
          The page or product you are looking for has either concluded its production run or been relocated in our wardrobe.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <span>Return to Homepage</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/collections/scrubs" className="btn btn-outline">
            <span>Explore All Scrubs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
