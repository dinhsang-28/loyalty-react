import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const TrackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const trackReferral = async () => {
      const ref = searchParams.get('ref');
      
      if (ref) {
        try {
          await axios.get(`/api/track?ref=${ref}`);
        } catch (error) {
          console.error('Tracking failed:', error);
        }
      }
      
      navigate('/');
    };

    trackReferral();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-foreground text-lg">Tracking referral...</div>
    </div>
  );
};

export default TrackPage;
