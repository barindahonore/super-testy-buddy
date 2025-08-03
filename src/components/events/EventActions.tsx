import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Event, EventRegistration, registerForEvent } from '@/services/api';
import { MyTeam } from '@/services/teamApi';

interface EventActionsProps {
  event: Event;
  user: any;
  registrationStatus: EventRegistration | null;
  teamStatus: MyTeam | null;
  onRegistrationSuccess: () => void;
}

export const EventActions: React.FC<EventActionsProps> = ({
  event,
  user,
  registrationStatus,
  teamStatus,
  onRegistrationSuccess,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsRegistering(true);
    try {
      await registerForEvent(event.id);
      toast({
        title: 'Registration Successful!',
        description: 'You have been registered for this event.',
      });
      onRegistrationSuccess();
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Failed to register for event',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-6 sm:py-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Join This Event</h3>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            You need to be logged in to register for events and unlock exclusive features.
          </p>
          <Button onClick={() => navigate('/login')} size="lg" className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold group shadow-xl hover:shadow-2xl transition-all duration-300">
            <LogIn className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Login to Register
          </Button>
        </div>
      );
    }

    if (registrationStatus) {
      return (
        <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              You're Registered! 🎉
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg">
              Registered on {new Date(registrationStatus.registeredAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      );
    }

    if (event.status === 'CANCELLED') {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl sm:text-4xl">⚠️</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-destructive mb-2">Event Cancelled</h3>
          <p className="text-muted-foreground text-base sm:text-lg">
            This event has been cancelled by the organizers.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-6 sm:py-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Register for This Event</h3>
        <p className="text-muted-foreground mb-8 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Join this exciting event and be part of an amazing experience with fellow students.
        </p>
        <Button
          onClick={handleRegister}
          disabled={isRegistering}
          size="lg"
          className="h-12 sm:h-14 px-6 sm:px-8 text-base font-semibold group shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
        >
          {isRegistering ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Register Now
            </>
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <Card className="bg-card/95 backdrop-blur-lg border-border/20 shadow-2xl hover:shadow-elegant transition-all duration-300 rounded-2xl sm:rounded-3xl">
        <CardContent className="p-6 sm:p-8 lg:p-10">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};