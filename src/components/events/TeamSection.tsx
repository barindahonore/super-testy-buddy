
import { Users, Plus, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MyTeam } from '@/services/teamApi';

interface TeamSectionProps {
  teamStatus: MyTeam | null;
  isTeamBased: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ teamStatus, isTeamBased }) => {
  if (!isTeamBased) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teamStatus ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-lg">{teamStatus.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Invitation Code: <code className="bg-accent px-2 py-1 rounded">{teamStatus.invitationCode}</code>
                </p>
              </div>
              {teamStatus.submission && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Submitted
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h5 className="font-medium">Team Members ({teamStatus.members.length})</h5>
              <div className="space-y-2">
                {teamStatus.members.map((member) => (
                  <div
                    key={member.user.id}
                    className="flex items-center justify-between p-2 bg-accent/5 rounded"
                  >
                    <span className="text-sm">
                      {member.user.firstName} {member.user.lastName}
                    </span>
                    <Badge variant={member.role === 'LEADER' ? 'default' : 'secondary'} className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No Team Yet</h4>
            <p className="text-muted-foreground mb-6">
              This is a team-based competition. You need to create or join a team to participate.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Team
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Join Team
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
