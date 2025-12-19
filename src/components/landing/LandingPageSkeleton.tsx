import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 px-4">
      <div className="w-full max-w-6xl mx-auto text-center space-y-6">
        {/* Title badge */}
        <Skeleton className="h-12 w-64 mx-auto rounded-xl" />
        
        {/* Badge */}
        <Skeleton className="h-8 w-80 mx-auto rounded-full" />
        
        {/* Headline */}
        <div className="space-y-3">
          <Skeleton className="h-12 sm:h-16 w-3/4 mx-auto" />
          <Skeleton className="h-8 sm:h-12 w-2/3 mx-auto" />
        </div>
        
        {/* Subheadline */}
        <Skeleton className="h-6 w-96 mx-auto max-w-full" />
        
        {/* Social proof pills */}
        <div className="flex flex-wrap justify-center gap-2">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-7 w-48 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full hidden sm:block" />
        </div>
        
        {/* User count */}
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        
        {/* Hero image */}
        <Skeleton className="h-48 sm:h-64 md:h-80 w-full max-w-4xl mx-auto rounded-2xl" />
        
        {/* CTA */}
        <Skeleton className="h-14 sm:h-16 w-64 mx-auto rounded-lg" />
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-6 border-t border-border/50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TestimonialsSkeleton = () => {
  return (
    <section className="py-12 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg border bg-card">
              <Skeleton className="h-8 w-8 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-6" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const LandingPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation skeleton */}
      <div className="h-16 border-b bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <div className="hidden md:flex gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
      
      <HeroSkeleton />
      <TestimonialsSkeleton />
    </div>
  );
};
