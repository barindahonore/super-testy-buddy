
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
    <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
      <Card className="bg-card/95 backdrop-blur-lg border-border/20 shadow-2xl hover:shadow-elegant transition-all duration-300 rounded-2xl sm:rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamStatus ? (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-xl sm:text-2xl text-foreground">{teamStatus.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Invitation Code:</span>
                    <code className="bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-lg font-mono text-primary border border-primary/20 text-sm font-semibold">
                      {teamStatus.invitationCode}
                    </code>
                  </div>
                </div>
                {teamStatus.submission && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-4 py-2 text-sm">
                    ✅ Submitted
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-lg sm:text-xl text-foreground">
                  Team Members ({teamStatus.members.length})
                </h5>
                <div className="grid gap-3">
                  {teamStatus.members.map((member, index) => (
                    <div
                      key={member.user.id}
                      className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-border/20 hover:border-border/40 transition-all duration-300 hover:shadow-lg group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-primary font-semibold text-sm">
                            {member.user.firstName[0]}{member.user.lastName[0]}
                          </span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {member.user.firstName} {member.user.lastName}
                        </span>
                      </div>
                      <Badge variant={member.role === 'LEADER' ? 'default' : 'secondary'} className="px-3 py-1">
                        {member.role === 'LEADER' ? '👑 Leader' : 'Member'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">No Team Yet</h4>
              <p className="text-muted-foreground mb-8 sm:mb-10 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                This is a team-based competition. You need to create or join a team to participate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold group border-2 hover:shadow-lg transition-all duration-300">
                  <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Create Team
                </Button>
                <Button variant="outline" size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold group border-2 hover:shadow-lg transition-all duration-300">
                  <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Join Team
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
