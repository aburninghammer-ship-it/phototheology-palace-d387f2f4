import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Building2, BookOpen, Lightbulb, Crown } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Building2 className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">The Palace of Biblical Wisdom</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
            Phototheology
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Transform Bible study into a palace of meaning. Store Scripture as vivid images, patterns, 
            and structures through an 8-floor, 38-room method.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-palace text-primary-foreground shadow-elegant hover:shadow-hover">
              <Link to="/palace">
                <Building2 className="mr-2 h-5 w-5" />
                Explore the Palace
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/floor/1">
                <BookOpen className="mr-2 h-5 w-5" />
                Start Floor 1
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-8">
            The Vision
          </h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Phototheology exists because the Bible is not only a book of words; it is a book of <strong className="text-foreground">images, 
              symbols, and living stories</strong>. God has always taught visually and narratively—Adam clothed in skins, 
              Noah's rainbow, Abraham's stars, Moses' sanctuary, Jesus' parables, John's Revelation movie.
            </p>
            
            <p>
              Phototheology restores that method. It teaches you to store Scripture as <strong className="text-foreground">images, patterns, 
              and structures</strong>. Instead of random notes scattered across a page, your mind becomes a <em>palace of meaning</em>, 
              with every story, verse, and prophecy stored in its proper chamber.
            </p>
            
            <p className="text-foreground font-medium text-center py-4">
              The vision is not just information—it is <strong>formation</strong>. Think Phototheologically: 
              reflexively seeing Christ in all Scripture, instinctively mapping verses into cycles, 
              instantly recalling patterns and prophecies.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-center mb-12">
            The Eight-Floor Method
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border shadow-elegant hover:shadow-hover transition-smooth">
              <div className="w-12 h-12 rounded-full gradient-palace flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Floors 1-2</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Furnishing & Investigation</strong> — Fill your shelves with stories 
                and become a detective of the Word.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border shadow-elegant hover:shadow-hover transition-smooth">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Floors 3-4</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Freestyle & Next Level</strong> — Connect Scripture to daily life 
                and expand through Christ-centered dimensions.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border shadow-elegant hover:shadow-hover transition-smooth">
              <div className="w-12 h-12 rounded-full gradient-palace flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Floors 5-6</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Vision & Horizons</strong> — Open the prophetic telescope; 
                see sanctuary, feasts, cycles, and cosmic dimensions.
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border shadow-elegant hover:shadow-hover transition-smooth">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center mb-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">Floors 7-8</h3>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Spiritual & Master</strong> — Bring heart into fire, 
                then let the palace become reflexive thought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
            Enter the Palace
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Each floor has its own discipline. Together they form a complete method of Bible study 
            that combines memory, imagination, theology, prophecy, and devotion.
          </p>
          <Button asChild size="lg" className="gradient-palace text-primary-foreground shadow-elegant">
            <Link to="/palace">
              <Building2 className="mr-2 h-5 w-5" />
              Begin Your Journey
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Phototheology — The Magnum Opus of Visual Biblical Formation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
