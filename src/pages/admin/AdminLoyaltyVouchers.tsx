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
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  code: string;
  expiryDate: string;
}

const AdminLoyaltyVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: '',
    code: '',
    expiryDate: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get('/api/admin/loyalty/vouchers');
      setVouchers(response.data);
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVoucher) {
        await axios.put(`/api/admin/loyalty/vouchers/${editingVoucher.id}`, formData);
        toast({ title: 'Success', description: 'Voucher updated successfully' });
      } else {
        await axios.post('/api/admin/loyalty/vouchers', formData);
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
      await axios.delete(`/api/admin/loyalty/vouchers/${id}`);
      toast({ title: 'Success', description: 'Voucher deleted successfully' });
      fetchVouchers();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setFormData({
      name: voucher.name,
      description: voucher.description,
      pointsCost: voucher.pointsCost.toString(),
      code: voucher.code,
      expiryDate: voucher.expiryDate,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVoucher(null);
    setFormData({ name: '', description: '', pointsCost: '', code: '', expiryDate: '' });
  };

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
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingVoucher ? 'EditIcon Voucher' : 'Create Voucher'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Voucher Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  Points Cost
                </Label>
                <Input
                  id="pointsCost"
                  type="number"
                  value={formData.pointsCost}
                  onChange={(e) => setFormData({ ...formData, pointsCost: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="code" className="text-foreground">
                  Voucher Code
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate" className="text-foreground">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
          <Card key={voucher.id} className="p-6 bg-card text-card-foreground border-border">
            <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
              {voucher.name}
            </h3>
            <p className="text-muted-foreground mb-2">{voucher.description}</p>
            <p className="text-muted-foreground mb-2">Cost: {voucher.pointsCost} points</p>
            <p className="text-muted-foreground mb-2">Code: {voucher.code}</p>
            <p className="text-muted-foreground mb-4">Expires: {voucher.expiryDate}</p>
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
                onClick={() => handleDelete(voucher.id)}
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
