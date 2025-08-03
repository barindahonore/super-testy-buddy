
import { format } from 'date-fns';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/services/api';

interface EventHeaderProps {
  event: Event;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'default';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Upcoming';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

export const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  return (
    <div className="relative animate-fade-in">
      <div className="bg-card/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/20 shadow-2xl hover:shadow-elegant transition-all duration-300">
        {/* Status and Competition Badges */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Badge variant={getStatusVariant(event.status)} className="text-sm sm:text-base px-3 py-1.5 shadow-lg">
            {getStatusLabel(event.status)}
          </Badge>
          {event.competition && (
            <Badge className="text-sm sm:text-base px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              🏆 Competition
            </Badge>
          )}
        </div>
        
        {/* Event Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-[1.1] tracking-tight">
          {event.title}
        </h1>
        
        {/* Event Description */}
        {event.description && (
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-4xl">
            {event.description}
          </p>
        )}
        
        {/* Event Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-primary/5 rounded-xl sm:rounded-2xl border border-primary/10 hover:bg-primary/10 transition-colors duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Date</div>
              <div className="text-sm sm:text-base font-semibold text-foreground">
                {format(new Date(event.startTime), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-secondary/5 rounded-xl sm:rounded-2xl border border-secondary/10 hover:bg-secondary/10 transition-colors duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Time</div>
              <div className="text-sm sm:text-base font-semibold text-foreground">
                {format(new Date(event.startTime), 'h:mm a')}
              </div>
            </div>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-accent/5 rounded-xl sm:rounded-2xl border border-accent/10 hover:bg-accent/10 transition-colors duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Location</div>
                <div className="text-sm sm:text-base font-semibold text-foreground">{event.location}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-xl sm:rounded-2xl border border-border/20 hover:bg-muted/70 transition-colors duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Organizer</div>
              <div className="text-sm sm:text-base font-semibold text-foreground">
                {event.organizer.firstName} {event.organizer.lastName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
