import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Shield, Zap, Globe, ArrowRight } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CryptoVaultageFx</h1>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Secure Crypto Trading & Investment Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience seamless cryptocurrency trading with automated investments, 
            secure wallets, and professional-grade analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground">
            Why Choose CryptoVaultageFx?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Auto Investment</h3>
              <p className="text-muted-foreground">
                Smart algorithms automatically invest your idle funds into profitable plans.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Secure Wallets</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security for your digital assets with multi-layer protection.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Real-Time Trading</h3>
              <p className="text-muted-foreground">
                Execute trades instantly with live market data and advanced charting tools.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Global Markets</h3>
              <p className="text-muted-foreground">
                Access worldwide cryptocurrency markets from a single unified platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of traders who trust CryptoVaultageFx for their crypto investments.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="gap-2"
          >
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            © 2024 CryptoVaultageFx. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
