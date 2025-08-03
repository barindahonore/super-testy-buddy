
import { Trophy, Users, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Competition } from '@/services/api';

interface CompetitionInfoProps {
  competition: Competition;
}

export const CompetitionInfo: React.FC<CompetitionInfoProps> = ({ competition }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Competition Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Requirements */}
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-primary mt-1" />
          <div>
            <h4 className="font-semibold mb-2">Team Requirements</h4>
            {competition.isTeamBased ? (
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">
                  Team-Based Competition
                </Badge>
                {competition.minTeamSize && competition.maxTeamSize && (
                  <p className="text-sm text-muted-foreground">
                    Team size: {competition.minTeamSize} - {competition.maxTeamSize} members
                  </p>
                )}
              </div>
            ) : (
              <Badge variant="outline">Individual Competition</Badge>
            )}
          </div>
        </div>

        {/* Judging Criteria */}
        {competition.judgingCriteria && competition.judgingCriteria.length > 0 && (
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold mb-3">Judging Criteria</h4>
              <div className="grid gap-3">
                {competition.judgingCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-accent/5 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="font-medium">{criterion.name}</span>
                    </div>
                    {criterion.weight && (
                      <Badge variant="secondary">
                        {criterion.weight} points
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
