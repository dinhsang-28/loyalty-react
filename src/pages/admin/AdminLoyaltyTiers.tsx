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

interface Tier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string;
}

const AdminLoyaltyTiers = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    minPoints: '',
    benefits: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const response = await axios.get('/api/admin/loyalty/tiers');
      setTiers(response.data);
    } catch (error) {
      console.error('Failed to fetch tiers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTier) {
        await axios.put(`/api/admin/loyalty/tiers/${editingTier.id}`, formData);
        toast({ title: 'Success', description: 'Tier updated successfully' });
      } else {
        await axios.post('/api/admin/loyalty/tiers', formData);
        toast({ title: 'Success', description: 'Tier created successfully' });
      }
      fetchTiers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/loyalty/tiers/${id}`);
      toast({ title: 'Success', description: 'Tier deleted successfully' });
      fetchTiers();
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleEdit = (tier: Tier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      minPoints: tier.minPoints.toString(),
      benefits: tier.benefits,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTier(null);
    setFormData({ name: '', minPoints: '', benefits: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold text-foreground">Loyalty Tiers</h1>
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
                <Label htmlFor="minPoints" className="text-foreground">
                  Minimum Points
                </Label>
                <Input
                  id="minPoints"
                  type="number"
                  value={formData.minPoints}
                  onChange={(e) => setFormData({ ...formData, minPoints: e.target.value })}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="benefits" className="text-foreground">
                  Benefits
                </Label>
                <Input
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
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
        {tiers.map((tier) => (
          <Card key={tier.id} className="p-6 bg-card text-card-foreground border-border">
            <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
              {tier.name}
            </h3>
            <p className="text-muted-foreground mb-2">Min Points: {tier.minPoints}</p>
            <p className="text-muted-foreground mb-4">{tier.benefits}</p>
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
                onClick={() => handleDelete(tier.id)}
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

export default AdminLoyaltyTiers;
