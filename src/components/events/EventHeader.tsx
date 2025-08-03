
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
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant={getStatusVariant(event.status)} className="text-sm">
              {getStatusLabel(event.status)}
            </Badge>
            {event.competition && (
              <Badge variant="outline" className="text-sm">
                Competition
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {event.title}
          </h1>
          
          {event.description && (
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {event.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(event.startTime), 'PPP')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{format(new Date(event.startTime), 'p')}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>
                Organized by {event.organizer.firstName} {event.organizer.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
