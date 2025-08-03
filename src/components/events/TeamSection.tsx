
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
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="w-6 h-6 text-primary" />
          Team Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teamStatus ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xl mb-2">{teamStatus.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Invitation Code: <code className="bg-accent px-2 py-1 rounded font-mono text-primary">{teamStatus.invitationCode}</code>
                </p>
              </div>
              {teamStatus.submission && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Submitted
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-lg">Team Members ({teamStatus.members.length})</h5>
              <div className="space-y-2">
                {teamStatus.members.map((member) => (
                  <div
                    key={member.user.id}
                    className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20"
                  >
                    <span className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </span>
                    <Badge variant={member.role === 'LEADER' ? 'default' : 'secondary'}>
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h4 className="text-2xl font-semibold mb-3">No Team Yet</h4>
            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
              This is a team-based competition. You need to create or join a team to participate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Team
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
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
