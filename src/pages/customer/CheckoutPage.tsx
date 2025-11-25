"use client";
import  { useState, useEffect } from 'react';
import { ShoppingBag, Tag, Loader2, CheckCircle, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ShippingInfo {
  name: string;
  phone: string;
  address: string;
}

interface Voucher {
  _id: string;
  title: string;
  status: string;
  benefit: 'fixed' | 'percentage';
  value: number;
  minValue?: number;
  maxDiscount?: number;
  validTo?: string; // ISO date string
}

interface Redemption {
  _id: string;
  voucherId: Voucher; // ID string
  voucherCode: string;
  status: string;
}

interface SelectedVoucher {
  redemptionId: string;
  voucherCode: string;
  title: string;
  benefit: 'fixed' | 'percentage';
  value: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const CheckoutPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Order info
  const [orderAmount, setOrderAmount] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { name: '', quantity: 1, price: 0 }
  ]);

  // Shipping info state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    phone: '',
    address: '',
  });

  // Voucher state
  const [myVouchers, setMyVouchers] = useState<Redemption[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<SelectedVoucher | null>(null);
  const [voucherDialogOpen, setVoucherDialogOpen] = useState(false);

  // Calculate totals
  const subtotal = parseFloat(orderAmount) || 0;
  const [finalAmount, setFinalAmount] = useState(subtotal);
  const [discount, setDiscount] = useState(0);
   const https="https://loyaty-be.onrender.com"
  // const https="https://loyaty-be.onrender.com"
  useEffect(() => {
    setFinalAmount(Math.max(0, subtotal - discount));
  }, [subtotal, discount]);

  // Load my vouchers
  const loadMyVouchers = async () => {
    setIsLoadingVouchers(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập');
      }

      const response = await fetch(`${https}/api/loyalty/my-voucher`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải voucher');
      }

      const result: ApiResponse<Redemption[]> = await response.json();
      const availableVouchers = result.data.filter((v: Redemption) => v.status === 'redeemed');
      setMyVouchers(availableVouchers);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách voucher',
      });
    } finally {
      setIsLoadingVouchers(false);
    }
  };
  // Handle order items
  const addOrderItem = () => {
    setOrderItems([...orderItems, { name: '', quantity: 1, price: 0 }]);
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    if (field === 'name') {
      newItems[index][field] = value as string;  // Ensure string for 'name'
    } else {
      // For 'quantity' and 'price', ensure number
      newItems[index][field] = typeof value === 'string' ? parseFloat(value) || 0 : value;
    }
    setOrderItems(newItems);
    // Tự động tính tổng tiền
    const total = newItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setOrderAmount(total.toString());
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      const newItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(newItems);

      const total = newItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      setOrderAmount(total.toString());
    }
  };

  // Apply voucher from list
  const handleSelectVoucher = (redemption: Redemption) => {
    const voucher = redemption.voucherId;
    if (!voucher) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải chi tiết voucher',
      });
      return;
    }

    if (voucher.status !== 'active') {
      toast({
        variant: 'destructive',
        title: 'Voucher không khả dụng',
        description: 'Voucher này hiện không hoạt động',
      });
      return;
    }

    if (voucher.validTo && new Date(voucher.validTo) < new Date()) {
      toast({
        variant: 'destructive',
        title: 'Voucher hết hạn',
        description: 'Voucher này đã hết hạn sử dụng',
      });
      return;
    }

    if (voucher.minValue && subtotal < voucher.minValue) {
      toast({
        variant: 'destructive',
        title: 'Không đủ điều kiện',
        description: `Đơn hàng tối thiểu ${voucher.minValue.toLocaleString()}đ để sử dụng voucher này`,
      });
      return;
    }

    let calculatedDiscount = 0;
    if (voucher.benefit === 'fixed') {
      calculatedDiscount = voucher.value;
    } else if (voucher.benefit === 'percentage') {
      calculatedDiscount = subtotal * (voucher.value / 100);
      if (voucher.maxDiscount && calculatedDiscount > voucher.maxDiscount) {
        calculatedDiscount = voucher.maxDiscount;
      }
    }
    // Đảm bảo giảm giá không vượt quá tổng tiền
    if (calculatedDiscount > subtotal) {
        calculatedDiscount = subtotal;
    }

    setSelectedVoucher({
      redemptionId: redemption._id,
      voucherCode: redemption.voucherCode,
      title: voucher.title || 'Mã giảm giá',
      benefit: voucher.benefit,
      value: voucher.value,
    });
    setDiscount(calculatedDiscount);
    setVoucherDialogOpen(false);

    toast({
      title: 'Áp dụng thành công!',
      description: `Bạn được giảm ${calculatedDiscount.toLocaleString()}đ`,
    });
  };

  const removeVoucher = () => {
    setSelectedVoucher(null);
    setDiscount(0);
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Thiếu thông tin',
        description: 'Vui lòng nhập tổng tiền đơn hàng',
      });
      return;
    }

    const validItems = orderItems.filter(item => item.name && item.quantity > 0 && item.price > 0);
    if (validItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Thiếu thông tin',
        description: 'Vui lòng nhập ít nhất 1 sản phẩm hợp lệ',
      });
      return;
    }

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast({
        variant: 'destructive',
        title: 'Thiếu thông tin',
        description: 'Vui lòng điền đầy đủ thông tin giao hàng',
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để đặt hàng');
      }

      const orderData = {
        items: validItems,
        total_amount: subtotal,
        shipping_address: shippingInfo,
        redemptionCode: selectedVoucher?.redemptionId || null,

      };

      const response = await fetch(`${https}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi từ máy chủ');
      }

      const result: ApiResponse<{ _id: string }> = await response.json();
      setOrderSuccess(true);
      setOrderId(result.data._id);

      toast({
        title: 'Đặt hàng thành công!',
        description: `Mã đơn hàng: ${result.data._id}`,
      });

      setTimeout(() => {
        setOrderAmount('');
        setOrderItems([{ name: '', quantity: 1, price: 0 }]);
        setShippingInfo({ name: '', phone: '', address: '' });
        setSelectedVoucher(null);
        setDiscount(0);
        setOrderSuccess(false);
        setOrderId('');
      }, 5000);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Đặt hàng thất bại',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Đặt hàng thành công!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Mã đơn hàng: <strong>{orderId}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn ngay.
              <br />
              Bạn đã được cộng điểm thưởng vào tài khoản!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <ShoppingBag className="w-8 h-8" />
        Tạo đơn hàng mới
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Order Info & Shipping */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin sản phẩm</CardTitle>
              <CardDescription>
                Nhập chi tiết sản phẩm trong đơn hàng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="font-semibold">Sản phẩm {index + 1}</span>
                    {orderItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(index)}
                        className="text-red-500"
                      >
                        Xóa
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Tên sản phẩm</Label>
                      <Input
                        placeholder="Nhập tên sản phẩm"
                        value={item.name}
                        onChange={(e) => updateOrderItem(index, 'name', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Số lượng</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Đơn giá (đ)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', e.target.value)}
                      />
                    </div>
                  </div>

                  {item.name && item.quantity > 0 && item.price > 0 && (
                    <div className="text-right text-sm text-muted-foreground">
                      Thành tiền: <strong>{(item.quantity * item.price).toLocaleString()}đ</strong>
                    </div>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={addOrderItem}
              >
                + Thêm sản phẩm
              </Button>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="0912345678"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ giao hàng</Label>
                <Input
                  id="address"
                  placeholder="123 Đường ABC, Quận XYZ, TP..."
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Voucher */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Mã giảm giá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!selectedVoucher ? (
                <Dialog open={voucherDialogOpen} onOpenChange={setVoucherDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={loadMyVouchers}
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Chọn voucher của tôi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Voucher của tôi</DialogTitle>
                      <DialogDescription>
                        Chọn voucher bạn muốn sử dụng cho đơn hàng này
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[400px] pr-4">
                      {isLoadingVouchers ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      ) : myVouchers.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Bạn chưa có voucher nào
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {myVouchers.map((redemption:Redemption) => {
                            const voucher = redemption.voucherId;
                            if (!voucher) return null; // Handle loading state

                            const isExpired = voucher.validTo && new Date(voucher.validTo) < new Date();
                            const notEnough = voucher.minValue && subtotal < voucher.minValue;
                            const isInactive = voucher.status !== 'active';
                            const isDisabled = isExpired || notEnough || isInactive;

                            return (
                              <div
                                key={redemption._id}
                                className={`border rounded-lg p-4 ${isDisabled ? 'opacity-50' : 'cursor-pointer hover:border-primary'}`}
                                onClick={() => !isDisabled && handleSelectVoucher(redemption)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{voucher.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {voucher.benefit === 'fixed'
                                        ? `Giảm ${voucher.value.toLocaleString()}đ`
                                        : `Giảm ${voucher.value}%${voucher.maxDiscount ? ` (tối đa ${voucher.maxDiscount.toLocaleString()}đ)` : ''}`
                                      }
                                    </p>
                                    {voucher.minValue && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Đơn tối thiểu: {voucher.minValue.toLocaleString()}đ
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      Mã: {redemption.voucherCode}
                                    </p>
                                  </div>
                                  {isDisabled && (
                                    <span className="text-xs text-red-500">
                                      {isExpired ? 'Hết hạn' : isInactive ? 'Không khả dụng' : 'Không đủ điều kiện'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div>
                    <p className="font-semibold text-green-700">
                      {selectedVoucher.title}
                    </p>
                    <p className="text-xs text-green-600">
                      Giảm {discount.toLocaleString()}đ • {selectedVoucher.voucherCode}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeVoucher}
                    className="text-red-600"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span className="font-semibold">{subtotal.toLocaleString()}đ</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span className="font-semibold">-{discount.toLocaleString()}đ</span>
                </div>
              )}

              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold">Tổng cộng:</span>
                <span className="font-bold text-primary">
                  {finalAmount.toLocaleString()}đ
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt hàng'
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;