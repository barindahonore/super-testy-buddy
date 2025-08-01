
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Teams</h1>
            <p className="text-muted-foreground">Manage your team memberships</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Teams</h1>
            <p className="text-muted-foreground">Manage your team memberships</p>
          </div>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Teams</h3>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Teams</h1>
          <p className="text-muted-foreground">
            {myTeams.length > 0 
              ? `You are a member of ${myTeams.length} team${myTeams.length !== 1 ? 's' : ''}`
              : 'Manage your team memberships'
            }
          </p>
        </div>
      </div>

      {myTeams.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Teams Yet</h3>
            <p className="text-muted-foreground mb-4">
              You are not currently a member of any teams. Find a competition to join or create one!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Plus className="w-4 h-4" />
              <span>Join a team using an invitation code or create a new team</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
  );
};

export default MyTeamsPage;
