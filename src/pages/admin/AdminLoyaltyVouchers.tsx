import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { PlusIcon, EditIcon, Trash2Icon } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';


interface Voucher {
  _id: string;
  title: string;
  description: string;
  pointsRequired: number;
  totalQuantity: number;
  remainingQuantity: number;
  validFrom: string;
  validTo: string;
  status: string; // 'active', 'inactive'
  benefit: string; // Ví dụ: 'percentage', 'fixed'
  value: number; // Giá trị giảm
  minValue?: number;
  maxDiscount?: number;
}

const AdminLoyaltyVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pointsRequired: '',
    totalQuantity: '',
    validFrom: '',
    validTo: '',
    status: 'active',
    benefit: 'fixed', // Hoặc 'percentage'
    value: '',
    minValue: '',
    maxDiscount: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVouchers();
  }, []);
  const https = "https://loyaty-be.onrender.com";

  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${https}/api/public/staff/vouchers?limit=100`);
      setVouchers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pointsRequired: Number(formData.pointsRequired),
      totalQuantity: Number(formData.totalQuantity),
      value: Number(formData.value),
      minValue: formData.minValue ? Number(formData.minValue) : 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : 0
    }

    try {
      if (editingVoucher) {
        await axios.patch(`${https}/api/public/staff/edit/vouchers/${editingVoucher._id}`, payload);
        toast({ title: 'Success', description: 'Voucher updated successfully' });
      } else {
        await axios.post(`${https}/api/public/staff/vouchers`, payload);
        toast({ title: 'Success', description: 'Voucher created successfully' });
      }
      fetchVouchers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${https}/api/public/staff/delete/vouchers/${id}`);
      toast({ title: 'Success', description: 'Voucher deleted successfully' });
      fetchVouchers();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      title: voucher.title,
      description: voucher.description,
      pointsRequired: voucher.pointsRequired.toString(),
      totalQuantity: voucher.totalQuantity.toString(),
      validFrom: formatDateForInput(voucher.validFrom),
      validTo: formatDateForInput(voucher.validTo),
      status: voucher.status,
      benefit: voucher.benefit,
      value: voucher.value.toString(),
      minValue: voucher.minValue?.toString() || '',
      maxDiscount: voucher.maxDiscount?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVoucher(null);
    setFormData({
      title: '',
      description: '',
      pointsRequired: '',
      totalQuantity: '',
      validFrom: '',
      validTo: '',
      status: 'active',
      benefit: 'fixed',
      value: '',
      minValue: '',
      maxDiscount: ''
    });
  };
  const formatCurrency = (amount: any) => {
    const number = parseFloat(amount);
    if (isNaN(number)) return '0';

    return new Intl.NumberFormat('vi-VN', {
      // style:'currency',
      // currency:'VND',
      // minimumFractionDigits: 2,
    }).format(number)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold text-foreground">Loyalty Vouchers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingVoucher ? 'EditIcon Voucher' : 'Create Voucher'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-foreground">
                  Voucher Name
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="pointsCost" className="text-foreground">
                  Points Required
                </Label>
                <Input
                  id="pointsCost"
                  type="number"
                  value={formData.pointsRequired}
                  onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="total" className="text-foreground">
                  Total Quantity
                </Label>
                <Input
                  id="total"
                  type='number'
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="benifits" className="text-foreground">
                  Benifits Type
                </Label>
                <select
                  id="benifits"
                  value={formData.benefit}
                  onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                  className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                >
                <option value="fixed">Số tiền cố định (VND)</option>
                <option value="percentage">Phần trăm (%)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status" className="text-foreground">
                  Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                >
                <option value="active">Hoạt Động</option>
                <option value="expired">Hết Hạn</option>
                <option value="inactive">Ngưng Hoạt Động</option>
                </select>
              </div>
              <div>
                <Label htmlFor="discount" className="text-foreground">
                  Discount Value
                </Label>
                <Input
                  id="discount"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="validfrom" className="text-foreground">
                  Valid From
                </Label>
                <Input
                  id="validfrom"
                  type='date'
                  value={formData.validFrom}
                  onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="validTo" className="text-foreground">
                  Expiry Date
                </Label>
                <Input
                  id="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="minorder" className="text-foreground">
                  Min Order Values
                </Label>
                <Input
                  id="minorder"
                  type='number'
                  value={formData.minValue}
                  onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="maxorder" className="text-foreground">
                  Max Order Values
                </Label>
                <Input
                  id="maxorder"
                  type='number'
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingVoucher ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.map((voucher) => (
          <Card key={voucher._id} className="p-6 bg-card text-card-foreground border-border">
            <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
              {voucher.title}
            </h3>
            <p className="text-muted-foreground mb-2">{voucher.description}</p>
            <p className="text-muted-foreground mb-2">Cost: {voucher.pointsRequired} points</p>
            <p className="text-muted-foreground mb-2">Discount: {formatCurrency(voucher.value)} {voucher.benefit === 'fixed' ? 'VND' : '%'}</p>
            <p className="text-muted-foreground mb-4">Quantity: {voucher.remainingQuantity}/{voucher.totalQuantity}</p>
            <p className="text-muted-foreground mb-4">Expires: {voucher.validTo ? new Date(voucher.validTo).toLocaleDateString() : 'N/A'}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(voucher)}
                variant="outline"
                size="sm"
                className="bg-background text-foreground border-border hover:bg-muted"
              >
                <EditIcon className="w-4 h-4 mr-2" />
                EditIcon
              </Button>
              <Button
                onClick={() => handleDelete(voucher._id)}
                variant="outline"
                size="sm"
                className="bg-background text-destructive border-border hover:bg-muted"
              >
                <Trash2Icon className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminLoyaltyVouchers;
