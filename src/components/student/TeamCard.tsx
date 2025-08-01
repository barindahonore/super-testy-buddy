
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Copy, 
  Crown, 
  User, 
  ExternalLink, 
  FileText, 
  Upload,
  LogOut,
  Trash2
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MyTeam, removeTeamMember } from '@/services/teamApi';

interface TeamCardProps {
  team: MyTeam;
  currentUserId: string;
  onLeaveTeam: (teamId: string) => void;
  onRemoveMember: (teamId: string, memberId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ 
  team, 
  currentUserId, 
  onLeaveTeam, 
  onRemoveMember 
}) => {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  const currentUserMember = team.members.find(member => member.user.id === currentUserId);
  const isLeader = currentUserMember?.role === 'LEADER';

  const copyInvitationCode = async () => {
    try {
      await navigator.clipboard.writeText(team.invitationCode);
      toast({
        title: "Copied!",
        description: "Invitation code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invitation code",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setIsRemoving(memberId);
    try {
      await removeTeamMember(team.id, memberId);
      onRemoveMember(team.id, memberId);
      toast({
        title: "Success",
        description: "Member removed from team",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {team.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Competition: {team.competition.event.title}
            </p>
            <Badge 
              variant={team.competition.event.status === 'IN_PROGRESS' ? 'default' : 'secondary'}
              className="mt-2"
            >
              {team.competition.event.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Invitation Code */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-2">Team Invitation Code</p>
          <div className="flex items-center gap-2">
            <code className="bg-background px-2 py-1 rounded text-sm font-mono flex-1">
              {team.invitationCode}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyInvitationCode}
              className="h-8 w-8 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <p className="text-sm font-medium mb-3">
            Team Members ({team.members.length})
          </p>
          <div className="space-y-2">
            {team.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {member.role === 'LEADER' ? (
                    <Crown className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <User className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">
                    {member.user.firstName} {member.user.lastName}
                  </span>
                  <Badge 
                    variant={member.role === 'LEADER' ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {member.role}
                  </Badge>
                </div>
                
                {/* Remove button - only for leaders, and not for themselves */}
                {isLeader && member.user.id !== currentUserId && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Team Member</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove {member.user.firstName} {member.user.lastName} from the team? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="destructive"
                          onClick={() => handleRemoveMember(member.user.id)}
                          disabled={isRemoving === member.user.id}
                        >
                          {isRemoving === member.user.id ? 'Removing...' : 'Remove Member'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Competition
          </Button>
          
          {team.submission ? (
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              View Submission
            </Button>
          ) : (
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Make Submission
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 text-destructive hover:text-destructive ml-auto"
              >
                <LogOut className="w-4 h-4" />
                Leave Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Team</DialogTitle>
                <DialogDescription>
                  Are you sure you want to leave "{team.name}"? You won't be able to access team resources or participate in the competition unless you're invited back.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => onLeaveTeam(team.id)}
                >
                  Leave Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
