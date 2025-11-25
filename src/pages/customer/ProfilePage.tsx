import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useToast } from '../../hooks/use-toast';  // <-- 1. Import useToast
import {
  Loader2,
  User,
  Phone,
  Mail
} from 'lucide-react'; // <-- 2. Xóa AlertCircle, CheckCircle
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface TierData {
  _id: string;
  name: string;
  min_points: number;
}

interface ProfileData {
  _id: string
  name: string;
  phone: string;
  user:{
    email:string
  };
  tier: TierData;
  points: number;
  isAffiliate: boolean;
}
interface formData {
  name: string,
  phone: string,
  email: string
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<formData>({
    name: '',
    phone: '',
    email: ''
  });
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // const https = 'https://loyaty-be.onrender.com/api';
  const https = 'https://loyaty-be.onrender.com';

  useEffect(() => {
    window.scroll(0, 0);
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          toast({
            title: "Lỗi",
            description: "Bạn cần đăng nhập để chỉnh sửa thông tin.",
          })
          return;
        }
        const respone = await axios.get(`${https}/loyalty/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile: ProfileData = respone.data.data;
        console.log("data respone:",respone.data.data);
        setFormData({
          name: profile.name,
          phone: profile.phone,
          email: profile.user.email,
        });
        setMemberId(profile._id);
      } catch (error) {
        console.error("fetch profile data khong thanh cong:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin cá nhân. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
      finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchProfile();
    }
    else {
      setLoading(false);
    }
  }, [user, toast]);
  console.log("data:",formData)
  // ham xu ly khi thay doi input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  };
  // ham xu ly thay doi
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!memberId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID thành viên. Không thể cập nhật.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        toast({
          title: "Lỗi",
          description: "Bạn cần đăng nhập để chỉnh sửa thông tin.",
        })
        return;
      }
      const response = await axios.patch(`${https}/api/loyalty/edit/${memberId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({
        title: "Thành công!",
        description: response.data.message || "Cập nhật thông tin thành công!",
        className: "bg-green-500 text-white",
      });
      setTimeout(() => {
        navigate('/profile')
      }, 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // 7. Thay thế setError bằng toast
      const errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
      toast({
        title: "Cập nhật thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    }
    finally {
      setLoading(false)
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 lg:px-8 bg-background flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    );
  }
  if (!user || !memberId) {
    return (
      <div className="min-h-screen py-16 px-4 lg:px-8 bg-background flex justify-center items-center">
        <p className="text-muted-foreground">Vui lòng đăng nhập lại.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
      <div className="container mx-auto max-w-lg">
        <Card className="bg-card text-card-foreground border-border w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl lg:text-4xl font-bold text-foreground">
              Chỉnh Sửa Thông Tin
            </CardTitle>
            <CardDescription>
              Cập nhật thông tin cá nhân của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và Tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Input Số Điện Thoại */}
              <div className="space-y-2">
                <Label htmlFor="phone">Số Điện Thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/Z-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Nút Submit và Hủy */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to="/profile">Hủy</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;