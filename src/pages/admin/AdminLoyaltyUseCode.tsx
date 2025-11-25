import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';
import { QrCodeIcon, PhoneIcon, CheckCircleIcon } from 'lucide-react';

const AdminLoyaltyUseCode = () => {
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim() || !code.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập cả số điện thoại và mã voucher",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    // Lưu ý: Đảm bảo base URL đúng với cấu hình server của bạn (có thể là /api/loyalty... hoặc /loyalty...)
    const API_URL = "http://localhost:3000/api/admin/loyalty"; 

    try {
      // Backend: [POST] /loyalty/use-code/:phone
      // Body: { code }
      const response = await axios.post(`${API_URL}/use-code/${phone}`, { 
        code: code 
      });

      toast({ 
        title: 'Thành công', 
        description: response.data.message || 'Mã đã được sử dụng thành công!',
        className: "bg-green-600 text-white border-none"
      });
      
      // Reset form sau khi thành công
      setCode('');
      // setPhone(''); // Có thể giữ lại phone để nhập mã tiếp nếu cần
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Lỗi khi xử lý mã';
      toast({ 
        title: 'Thất bại', 
        description: errorMsg, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <div className="mb-8 text-center">
        <h1 className="font-headline text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <QrCodeIcon className="w-8 h-8 text-primary" />
          Xác nhận dùng mã tại quầy
        </h1>
        <p className="text-muted-foreground mt-2">Nhập số điện thoại khách hàng và mã voucher để sử dụng.</p>
      </div>

      <Card className="p-8 bg-card text-card-foreground border-border shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" /> Số điện thoại khách hàng
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Ví dụ: 0987654321"
              className="mt-2 bg-background text-foreground border-border h-12 text-lg"
            />
          </div>

          {/* Input Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground flex items-center gap-2">
              <QrCodeIcon className="w-4 h-4" /> Mã Voucher (Code)
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())} // Tự động viết hoa mã
              required
              placeholder="Ví dụ: VC-A1B2C3D4"
              className="mt-2 bg-background text-foreground border-border h-12 text-lg font-mono uppercase tracking-widest"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">Đang xử lý...</span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" /> Xác nhận sử dụng
              </span>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoyaltyUseCode;