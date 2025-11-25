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
import { EditIcon } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

interface Member {
  _id: string;
  name: string;
  phone: string;
  redeemablePoints: number;
  tier:{
    name:string
  };
}

const AdminLoyaltyMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [pointsAdjustment, setPointsAdjustment] = useState('');
  const { toast } = useToast();
  const https = "https://loyaty-be.onrender.com";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${https}/api/admin/loyalty/members`);
      setMembers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };
  console.log("Data members:",members);

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingMember) return;

    try {
      await axios.post(`${https}/api/admin/loyalty/members/adjust-points/${editingMember._id}`, {
        amount: parseInt(pointsAdjustment),
      });
      toast({ title: 'Success', description: 'Points adjusted successfully' });
      fetchMembers();
      setIsDialogOpen(false);
      setPointsAdjustment('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to adjust points', variant: 'destructive' });
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setPointsAdjustment('');
    setIsDialogOpen(true);
  };

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-8">Loyalty Members</h1>

      <Card className="bg-card text-card-foreground border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Points</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members && members.map((member) => (
                <tr key={member._id} className="hover:bg-muted/50 transition-smooth">
                  <td className="px-6 py-4 text-foreground">{member.name}</td>
                  <td className="px-6 py-4 text-foreground">{member.phone}</td>
                  <td className="px-6 py-4 text-foreground">{member.redeemablePoints}</td>
                  <td className="px-6 py-4 text-foreground">{member.tier.name}</td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => handleEdit(member)}
                      variant="outline"
                      size="sm"
                      className="bg-background text-foreground border-border hover:bg-muted"
                    >
                      <EditIcon className="w-4 h-4 mr-2" />
                      Adjust Points
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Adjust Points</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <form onSubmit={handleAdjustPoints} className="space-y-4">
              <div>
                <p className="text-foreground mb-2">
                  Member: {editingMember.name} (Current: {editingMember.redeemablePoints} points)
                </p>
              </div>
              <div>
                <Label htmlFor="pointsAdjustment" className="text-foreground">
                  Points Adjustment (use negative for deduction)
                </Label>
                <Input
                  id="pointsAdjustment"
                  type="number"
                  value={pointsAdjustment}
                  onChange={(e) => setPointsAdjustment(e.target.value)}
                  required
                  placeholder="e.g., 100 or -50"
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Apply Adjustment
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoyaltyMembers;
