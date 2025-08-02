import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents, Event } from "@/services/api";
import { EventCard } from "@/components/events/EventCard";
import { SearchBar } from "@/components/events/SearchBar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const EventsListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 12;

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getAllEvents({
        search: searchTerm,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      // Filter out DRAFT events
      const publishedEvents = response.data.filter((event: Event) => event.status !== 'DRAFT');
      
      setEvents(publishedEvents);
      setTotalPages(Math.ceil(response.pagination?.total / ITEMS_PER_PAGE) || 1);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to load events. Please try again.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentPage, toast]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchEvents();
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm]);

  // Fetch events when page changes
  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const handleEventClick = (event: Event) => {
    if (event.competition) {
      navigate(`/competitions/${event.competition.id}`);
    } else {
      // For non-competition events, could navigate to event detail page
      navigate(`/events/${event.id}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Explore Events
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover upcoming competitions, workshops, and educational events
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-md mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search events by title or description..."
          />
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-8 border-destructive/50 text-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && renderSkeletons()}

        {/* Empty State */}
        {!isLoading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-6xl">📅</div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "No events match your search criteria. Try adjusting your search terms."
                  : "No events are currently available. Please check back later!"
                }
              </p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && events.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsListPage;