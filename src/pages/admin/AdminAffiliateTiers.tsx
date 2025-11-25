import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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

interface AffiliateTier {
  _id: string;
  name: string;
  commission_rate: number;
  min_sales: number;
}

const AdminAffiliateTiers = () => {
  const [tiers, setTiers] = useState<AffiliateTier[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<AffiliateTier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    commission_rate: '',
    min_sales: '',
  });
  const { toast } = useToast();
  const https = "https://loyaty-be.onrender.com"

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTiers();
  }, []);
  const fetchTiers = async () => {
    try {
      const response = await axios.get(`${https}/api/admin/affiliate/tiers`);
      setTiers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tiers:', error);
    }
  };
  console.log("Data Tiers:",tiers);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTier) {
        await axios.patch(`${https}/api/admin/affiliate/tiers/${editingTier._id}`, formData);
        toast({ title: 'Success', description: 'Tier updated successfully' });
      } else {
        await axios.post(`${https}/api/admin/affiliate/tiers`, formData);
        toast({ title: 'Success', description: 'Tier created successfully' });
      }
      fetchTiers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };
  console.log("data form gui tier",formData)

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${https}/api/admin/affiliate/delete-tiers/${id}`);
      toast({ title: 'Success', description: 'Tier deleted successfully' });
      fetchTiers();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleEdit = (tier: AffiliateTier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      commission_rate: tier.commission_rate.toString(),
      min_sales: tier.min_sales.toString(),
    });
    setIsDialogOpen(true);
  };
  console.log("data Form Edit:",formData);
  const resetForm = () => {
    setEditingTier(null);
    setFormData({ name: '', commission_rate: '', min_sales: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold text-foreground">Affiliate Tiers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingTier ? 'EditIcon Tier' : 'Create Tier'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Tier Name
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
                <Label htmlFor="commissionRate" className="text-foreground">
                  Commission Rate (%)
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.01"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="minOrders" className="text-foreground">
                  Minimum Orders
                </Label>
                <Input
                  id="minOrders"
                  type="number"
                  value={formData.min_sales}
                  onChange={(e) => setFormData({ ...formData, min_sales: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingTier ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers && tiers.map((tier) => (
          <Card key={tier._id} className="p-6 bg-card text-card-foreground border-border">
            <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
              {tier.name}
            </h3>
            <p className="text-muted-foreground mb-2">
              Commission: {tier.commission_rate}%
            </p>
            <p className="text-muted-foreground mb-4">Min Orders: {tier.min_sales}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(tier)}
                variant="outline"
                size="sm"
                className="bg-background text-foreground border-border hover:bg-muted"
              >
                <EditIcon className="w-4 h-4 mr-2" />
                EditIcon
              </Button>
              <Button
                onClick={() => handleDelete(tier._id)}
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

export default AdminAffiliateTiers;
