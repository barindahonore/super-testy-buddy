import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Trophy, Clock, ArrowRight } from "lucide-react";

const EventsPreview = () => {
  const events = [
    {
      id: 1,
      title: "Leadership Excellence Challenge",
      description: "A comprehensive leadership development competition focusing on strategic thinking and team management.",
      date: "2024-08-15",
      time: "10:00 AM",
      location: "Main Auditorium",
      category: "Leadership",
      participants: 45,
      maxParticipants: 60,
      status: "open",
      prize: "$500",
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "Innovation Hackathon 2024",
      description: "48-hour intensive hackathon to develop solutions for educational technology challenges.",
      date: "2024-08-22",
      time: "9:00 AM",
      location: "Tech Lab",
      category: "Technology",
      participants: 32,
      maxParticipants: 40,
      status: "open",
      prize: "$1000",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Academic Research Symposium",
      description: "Present your research findings and compete for the best academic paper award.",
      date: "2024-08-28",
      time: "2:00 PM",
      location: "Conference Hall",
      category: "Academic",
      participants: 28,
      maxParticipants: 30,
      status: "filling_fast",
      prize: "$300",
      difficulty: "Advanced"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Leadership: "bg-primary/10 text-primary",
      Technology: "bg-secondary/10 text-secondary", 
      Academic: "bg-accent/10 text-accent"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-secondary/10 text-secondary",
      filling_fast: "bg-accent/10 text-accent",
      full: "bg-destructive/10 text-destructive"
    };
    return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="events" className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs sm:text-sm font-medium">
            Upcoming Events
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Join Exciting
            <span className="text-secondary"> Educational Challenges</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover opportunities to showcase your skills, collaborate with peers, 
            and compete in various academic and leadership challenges.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
          {events.map((event, index) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="px-6 pb-4 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  {formatDate(event.date)}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  {event.time}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {event.location}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    {event.participants}/{event.maxParticipants} registered
                  </div>
                  <div className="flex items-center text-accent font-medium">
                    <Trophy className="w-4 h-4 mr-1" />
                    {event.prize}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <Button className="w-full group" variant="outline">
                  Register Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="gradient" size="lg" className="group">
            View All Events
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EventsPreview;