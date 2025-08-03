
import { Trophy, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Competition } from '@/services/api';

interface CompetitionInfoProps {
  competition: Competition;
}

export const CompetitionInfo: React.FC<CompetitionInfoProps> = ({ competition }) => {
  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <Card className="bg-card/95 backdrop-blur-lg border-border/20 shadow-2xl hover:shadow-elegant transition-all duration-300 rounded-2xl sm:rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            Competition Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Team Requirements */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg sm:text-xl text-foreground">Team Requirements</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="group">
                <div className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl sm:rounded-2xl border border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Format</div>
                    <div className="font-semibold text-foreground">
                      {competition.isTeamBased ? 'Team-based Competition' : 'Individual Competition'}
                    </div>
                  </div>
                </div>
              </div>
              
              {competition.isTeamBased && competition.minTeamSize && competition.maxTeamSize && (
                <div className="group">
                  <div className="flex items-center gap-4 p-4 sm:p-6 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-xl sm:rounded-2xl border border-secondary/20 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Team Size</div>
                      <div className="font-semibold text-foreground">
                        {competition.minTeamSize}-{competition.maxTeamSize} members
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Judging Criteria */}
          {competition.judgingCriteria && competition.judgingCriteria.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg sm:text-xl text-foreground">Judging Criteria</h4>
              <div className="grid gap-3 sm:gap-4">
                {competition.judgingCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-accent/5 to-accent/10 rounded-xl sm:rounded-2xl border border-accent/20 hover:border-accent/30 hover:shadow-lg transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground">{criterion.name}</span>
                    </div>
                    {criterion.weight && (
                      <Badge className="bg-gradient-to-r from-accent to-accent/80 text-white border-0 shadow-lg px-3 py-1.5">
                        {criterion.weight} points
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
