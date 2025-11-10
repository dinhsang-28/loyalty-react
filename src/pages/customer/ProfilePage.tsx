import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { AwardIcon, TrendingUpIcon } from 'lucide-react';
import axios from 'axios';

// 1. SỬA LỖI: Cập nhật Interface
// Interface 'Tier' phải là một object lồng nhau
interface TierData {
  _id: string;
  name: string;
  min_points: number;
  // Thêm các trường khác của Tier nếu cần
}

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  tier: TierData; // <-- Sửa từ 'string' thành 'TierData'
  points: number;
  isAffiliate: boolean;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false); // Đặt loading false nếu không có token
          return;
        }
        const response = await axios.get('http://localhost:3000/api/loyalty/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. SỬA LỖI: Di chuyển các đoạn return loading/error lên TRƯỚC
  // Phải kiểm tra loading trước
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 lg:px-8 bg-background flex justify-center items-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  // Kiểm tra nếu không có user (chưa login) hoặc không load được profile
  if (!user || !profile) {
    return (
      <div className="min-h-screen py-16 px-4 lg:px-8 bg-background flex justify-center items-center">
        <p className="text-muted-foreground">Could not load profile. Please login again.</p>
      </div>
    );
  }

  // 3. SỬA LỖI: Chỉ tính 'initials' sau khi đã chắc chắn 'profile' tồn tại
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
      <div className="container mx-auto max-w-lg">
        <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground mb-8 text-center">
          My Profile
        </h1>

        <div>
          <Card className="p-6 bg-card text-card-foreground border-border w-full">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {initials}
                </AvatarFallback>
                T      </Avatar>
              <h2 className="font-headline text-xl font-semibold text-foreground mb-2">
                {profile.name}
              </h2>
              <p className="text-muted-foreground mb-4">{profile.email}</p>

              {/* 4. SỬA LỖI: Hiển thị 'profile.tier.name' */}
              <Badge className="bg-accent text-accent-foreground mb-6">{profile.tier.name}</Badge>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <AwardIcon className="w-6 h-6 text-primary" />
                    <span className="text-foreground font-normal">Points</span>
                  </div>
                  <span className="font-headline text-xl font-bold text-foreground">
                    {profile.points}
                  </span>
                </div>

                {/* Dùng user.isAffiliate từ AuthContext là đúng */}
                {user.isAffiliate && (
                  <div className="flex items-center justify-between p-4 bg-tertiary/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUpIcon className="w-6 h-6 text-tertiary" />
                      <span className="text-foreground font-normal">Affiliate</span>
                    </div>
                    <Badge className="bg-tertiary text-tertiary-foreground">Active</Badge>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;