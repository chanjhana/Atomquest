import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function ManagerCommentModal() {
  return (
    <Card className="space-y-3 border-teal-200 bg-teal-50/70">
      <h3 className="font-semibold text-slate-950">Add Comment & Complete Review</h3>
      <Textarea name="managerComment" placeholder="Document check-in discussion and next steps..." />
      <Button type="submit">Mark Manager Reviewed</Button>
    </Card>
  );
}
