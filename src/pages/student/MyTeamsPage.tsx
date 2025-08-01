
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getMyTeams, leaveTeam, MyTeam } from '@/services/teamApi';
import TeamCard from '@/components/student/TeamCard';

const MyTeamsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myTeams, setMyTeams] = useState<MyTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTeams = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const teams = await getMyTeams();
      setMyTeams(teams);
    } catch (error: any) {
      console.error('Error fetching my teams:', error);
      setError('Failed to load your teams. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load your teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const handleLeaveTeam = async (teamId: string) => {
    try {
      await leaveTeam(teamId);
      setMyTeams(prev => prev.filter(team => team.id !== teamId));
      toast({
        title: "Success",
        description: "You have left the team",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the team",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    setMyTeams(prev => 
      prev.map(team => 
        team.id === teamId
          ? {
              ...team,
              members: team.members.filter(member => member.user.id !== memberId)
            }
          : team
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6 space-y-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              My Teams
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Manage your team memberships and collaborate on exciting competitions
            </p>
          </div>

          {/* Loading Skeleton */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              My Teams
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your team memberships and collaborate on exciting competitions
            </p>
          </div>

          {/* Error State */}
          <Card className="max-w-2xl mx-auto shadow-elegant">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Unable to Load Teams</h3>
              <p className="text-destructive text-lg mb-6">{error}</p>
              <Button onClick={fetchMyTeams} variant="outline" className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            My Teams
          </h1>
          <p className="text-muted-foreground text-lg">
            {myTeams.length > 0 
              ? `You are actively participating in ${myTeams.length} team${myTeams.length !== 1 ? 's' : ''}`
              : 'Start your collaborative journey'
            }
          </p>
        </div>

        {myTeams.length === 0 ? (
          <Card className="max-w-2xl mx-auto shadow-elegant">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Ready to Join a Team?</h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                You're not currently a member of any teams. Join exciting competitions and collaborate with fellow innovators!
              </p>
              <div className="flex items-center justify-center gap-3 text-primary/80 bg-primary/5 rounded-lg p-4 max-w-sm mx-auto">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Use an invitation code to join a team</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {myTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                currentUserId={user?.id || ''}
                onLeaveTeam={handleLeaveTeam}
                onRemoveMember={handleRemoveMember}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeamsPage;
