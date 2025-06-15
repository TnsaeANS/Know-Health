import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/30 via-background to-accent/30 py-16 md:py-24 shadow-lg">
      <div className="absolute inset-0 opacity-20">
         <Image 
            src="https://placehold.co/1200x400.png" // Placeholder image for background
            alt="Healthcare professionals"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="medical background"
          />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Find Your Trusted Healthcare Partner
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with the best doctors and facilities in Ethiopia. Your health journey starts here.
        </p>
        <div className="max-w-xl mx-auto mb-8">
          <form className="flex gap-2">
            <Input
              type="search"
              placeholder="Search doctors, specialties, facilities..."
              className="flex-grow text-base h-12 shadow-sm"
              aria-label="Search healthcare"
            />
            <Button type="submit" size="lg" className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </form>
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
            <Link href="/providers">Find a Doctor</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-md">
            <Link href="/facilities">Explore Facilities</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
