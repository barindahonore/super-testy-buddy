
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { getEventById, Event, EventRegistration, getMyEventRegistration } from '@/services/api';
import { getMyTeams, MyTeam } from '@/services/teamApi';
import { EventHeader } from '@/components/events/EventHeader';
import { EventActions } from '@/components/events/EventActions';
import { CompetitionInfo } from '@/components/events/CompetitionInfo';
import { TeamSection } from '@/components/events/TeamSection';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [teamStatus, setTeamStatus] = useState<MyTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Always fetch event details
      const eventData = await getEventById(id);
      setEvent(eventData);
      
      // Only fetch user-specific data if logged in
      if (user) {
        try {
          const registrationData = await getMyEventRegistration(id);
          setRegistration(registrationData);
          
          // If registered and it's a team-based competition, get team info
          if (registrationData && eventData.competition?.isTeamBased) {
            const teams = await getMyTeams();
            const relevantTeam = teams.find(team => 
              team.competition.event.id === eventData.id
            );
            setTeamStatus(relevantTeam || null);
          }
        } catch (userDataError) {
          console.log('User data fetch failed (user may not be registered):', userDataError);
          // Don't set error state for user-specific data failures
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  if (!id) {
    return <Navigate to="/events" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-white to-blue-50/30 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
            <Skeleton className="h-64 w-full rounded-2xl sm:rounded-3xl" />
            <Skeleton className="h-32 w-full rounded-2xl sm:rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-2xl sm:rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-white to-blue-50/30 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto">
            <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-2xl shadow-elegant">
              <AlertDescription className="text-destructive text-lg">
                {error || 'Event not found'}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-blue-50/30 overflow-hidden">
      {/* Modern grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <EventHeader event={event} />
          
          <EventActions
            event={event}
            user={user}
            registrationStatus={registration}
            teamStatus={teamStatus}
            onRegistrationSuccess={fetchData}
          />
          
          {event.competition && (
            <CompetitionInfo competition={event.competition} />
          )}
          
          {user && registration && event.competition && (
            <TeamSection
              teamStatus={teamStatus}
              isTeamBased={event.competition.isTeamBased}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
