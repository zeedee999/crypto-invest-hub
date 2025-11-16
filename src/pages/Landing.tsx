import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Shield, Globe, ArrowRight, CheckCircle2, Users, Award, HeadphonesIcon, Copy, BarChart3, DollarSign, PieChart, Activity, Mail, Phone, MapPin, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import cryptoHero from "@/assets/crypto-hero.jpg";
import tradingFloor from "@/assets/trading-floor.jpg";
import expertTeam from "@/assets/expert-team.jpg";
import binanceLogo from "@/assets/partners/binance-logo.png";
import coinbaseLogo from "@/assets/partners/coinbase-logo.png";
import krakenLogo from "@/assets/partners/kraken-logo.png";
import geminiLogo from "@/assets/partners/gemini-logo.png";
import bitfinexLogo from "@/assets/partners/bitfinex-logo.png";
import huobiLogo from "@/assets/partners/huobi-logo.png";
import sarahJohnson from "@/assets/testimonials/sarah-johnson.jpg";
import michaelChen from "@/assets/testimonials/michael-chen.jpg";
import emmaWilliams from "@/assets/testimonials/emma-williams.jpg";
import davidMartinez from "@/assets/testimonials/david-martinez.jpg";
import lisaAnderson from "@/assets/testimonials/lisa-anderson.jpg";
import jamesThompson from "@/assets/testimonials/james-thompson.jpg";
import rachelKim from "@/assets/testimonials/rachel-kim.jpg";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function Landing() {
  const navigate = useNavigate();
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const plans = [
    {
      name: "Starter Plan",
      price: "$1000",
      minDeposit: "Min: $1000",
      features: [
        "Basic Trading Tools",
        "Market Analysis",
        "Email Support",
        "5% Monthly Returns",
        "Crypto Portfolio",
      ],
    },
    {
      name: "Professional",
      price: "$5,000",
      minDeposit: "Min: $5,000",
      features: [
        "Advanced Trading Tools",
        "Priority Support",
        "Personal Account Manager",
        "8% Monthly Returns",
        "Premium Analytics",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$25,000",
      minDeposit: "Min: $25,000",
      features: [
        "Full Trading Suite",
        "24/7 VIP Support",
        "Dedicated Trading Team",
        "12% Monthly Returns",
        "Institutional Grade Tools",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Trader",
      content: "CryptoVaultageFx transformed my trading experience. The automated investment features and real-time analytics helped me grow my portfolio by 240% in just 6 months.",
      image: sarahJohnson,
    },
    {
      name: "Michael Chen",
      role: "Crypto Investor",
      content: "The platform's security features and expert support team gave me the confidence to invest more. Best decision I've made for my financial future.",
      image: michaelChen,
    },
    {
      name: "Emma Williams",
      role: "Day Trader",
      content: "I've tried many platforms, but none compare to the speed and reliability of CryptoVaultageFx. Their market insights are invaluable.",
      image: emmaWilliams,
    },
    {
      name: "David Martinez",
      role: "Crypto Investor",
      content: "The copy trading feature is a game-changer. I'm following top traders and seeing consistent profits every month. Highly recommend!",
      image: davidMartinez,
    },
    {
      name: "Lisa Anderson",
      role: "Financial Advisor",
      content: "As a financial advisor, I recommend CryptoVaultageFx to my clients. The platform's transparency and educational resources are outstanding.",
      image: lisaAnderson,
    },
    {
      name: "James Thompson",
      role: "Forex Trader",
      content: "Switched from forex to crypto with CryptoVaultageFx. The transition was seamless, and I'm now earning more than ever before.",
      image: jamesThompson,
    },
    {
      name: "Rachel Kim",
      role: "Investment Specialist",
      content: "The ETF and index trading options are excellent. CryptoVaultageFx offers everything I need in one platform with competitive fees.",
      image: rachelKim,
    },
  ];

  const faqs = [
    {
      question: "How do I get started with CryptoVaultageFx?",
      answer: "Simply click 'Sign Up Free' to create your account. After verifying your email, you can make your first deposit and start trading immediately.",
    },
    {
      question: "What cryptocurrencies can I trade?",
      answer: "We support all major cryptocurrencies including Bitcoin, Ethereum, USDT, and over 100+ altcoins with real-time market data.",
    },
    {
      question: "How secure is my investment?",
      answer: "We employ enterprise-grade security with multi-layer encryption, cold storage for funds, and 2FA authentication to protect your assets.",
    },
    {
      question: "What are the withdrawal processing times?",
      answer: "Withdrawals are typically processed within 24-48 hours. For VIP members, we offer priority processing within 12 hours.",
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes! We provide 24/7 customer support via live chat, email, and phone. Premium members get access to dedicated account managers.",
    },
  ];

  const services = [
    {
      title: "Copy Trading",
      description: "Copy trading allows you to directly copy the positions taken by another trader. You simply copy everything.",
      icon: Copy,
    },
    {
      title: "Financial Advisory",
      description: "We offer financial advice leading to smart trading by automating processes and improving decision-making.",
      icon: BarChart3,
    },
    {
      title: "Forex Trading",
      description: "Foreign Exchange Market, a global decentralized market for the trading of currencies.",
      icon: DollarSign,
    },
    {
      title: "Index Trading",
      description: "The ROI rates as high as up to 41%. Indices contains about 0.24%, thus is rated as a sweet spot.",
      icon: TrendingUp,
    },
    {
      title: "ETF Stocks",
      description: "Buy stocks, commodities, bonds, and other securities and place them where they will grow.",
      icon: PieChart,
    },
    {
      title: "CFDs",
      description: "Trade directly on CFDs without stress. You don't need a digital wallet or an account with an exchange.",
      icon: Activity,
    },
  ];

  const partners = [
    { name: "Binance", logo: binanceLogo },
    { name: "Coinbase", logo: coinbaseLogo },
    { name: "Kraken", logo: krakenLogo },
    { name: "Gemini", logo: geminiLogo },
    { name: "Bitfinex", logo: bitfinexLogo },
    { name: "Huobi", logo: huobiLogo },
  ];

  const licenses = [
    "Financial Conduct Authority (FCA) - UK",
    "Securities and Exchange Commission (SEC) - USA",
    "Australian Securities and Investments Commission (ASIC)",
    "Cyprus Securities and Exchange Commission (CySEC)",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Trading Ticker Marquee */}
      <div className="bg-card border-b border-border/40 overflow-hidden">
        <div className="flex animate-[slide_30s_linear_infinite] whitespace-nowrap py-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4">
              <span className="text-sm">BTC/USD <span className="text-green-500">↑ $67,234.50</span></span>
              <span className="text-sm">ETH/USD <span className="text-green-500">↑ $3,456.78</span></span>
              <span className="text-sm">BNB/USD <span className="text-red-500">↓ $432.21</span></span>
              <span className="text-sm">SOL/USD <span className="text-green-500">↑ $145.67</span></span>
              <span className="text-sm">ADA/USD <span className="text-green-500">↑ $0.56</span></span>
              <span className="text-sm">XRP/USD <span className="text-red-500">↓ $0.87</span></span>
              <span className="text-sm">DOT/USD <span className="text-green-500">↑ $8.23</span></span>
              <span className="text-sm">MATIC/USD <span className="text-green-500">↑ $1.12</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CryptoVaultageFx</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Login
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Image */}
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <img src={cryptoHero} alt="Crypto Trading" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Building a Better <span className="text-primary">Trading Future</span>
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
        </div>
      </section>

      {/* Experience Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-5xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-xl">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                We Have 10+ Years of Experience in Standard Professional Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                A platform that allows novice traders to copy/mirror professional traders' positions. We create all of the materials to assist you in growing and progressing to the next level. We're delighted you came across Our Company.
              </p>
              <p className="text-muted-foreground">
                Don't pass up this chance to hear about what we do and the incredible team that makes it all possible!
              </p>
              <Button size="lg" onClick={() => navigate('/auth')} className="gap-2">
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Why Choose CryptoVaultageFx?
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Our Commitment to help growing your business with cutting-edge technology and expert support
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 space-y-4 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Provide a Trading Experience</h3>
              <p className="text-muted-foreground">
                Advanced algorithms and real-time data for optimal trading decisions.
              </p>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </Card>

            <Card className="p-6 space-y-4 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Secure & Protected</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with multi-layer encryption and cold storage.
              </p>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </Card>

            <Card className="p-6 space-y-4 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">The Experts Behind Your Success</h3>
              <p className="text-muted-foreground">
                Professional traders and analysts supporting your investment journey.
              </p>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </Card>

            <Card className="p-6 space-y-4 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Empowering Traders Worldwide</h3>
              <p className="text-muted-foreground">
                Join thousands of successful traders across 150+ countries.
              </p>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Services We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer world class services around - Check out some of our services below
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="p-8 space-y-4 hover:border-primary/50 transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <service.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Floor Image Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
          <img src={tradingFloor} alt="Professional Trading Floor" className="w-full h-[400px] object-cover" />
        </div>
      </section>

      {/* Plans Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Explore Our Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To suit your financial budget. Our commitment to help growing your business with flexible investment options.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`p-8 space-y-6 relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">{plan.name}</h3>
                  <p className="text-3xl font-bold text-primary mt-2">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">{plan.minDeposit}</p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate('/auth')}
                >
                  Choose Plan
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Team Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src={expertTeam} alt="Our Expert Team" className="rounded-2xl border border-border/40 shadow-xl" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Experts Behind Your Success
              </h2>
              <p className="text-lg text-muted-foreground">
                Our team of seasoned professionals brings decades of combined experience in cryptocurrency trading, 
                blockchain technology, and financial markets.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">20+ Years Experience</h4>
                    <p className="text-muted-foreground">Combined expertise in global financial markets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">50,000+ Active Users</h4>
                    <p className="text-muted-foreground">Trusted by traders worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HeadphonesIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">24/7 Support</h4>
                    <p className="text-muted-foreground">Always here to help you succeed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            What Our Traders Say
          </h2>
          <p className="text-center text-muted-foreground mb-16">
            Real stories from real traders who transformed their financial future
          </p>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.name} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="p-6 space-y-4 h-full">
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div>
                        <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Partners Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Trusted Partners
          </h2>
          <p className="text-muted-foreground mb-12">
            Working with the world's leading cryptocurrency exchanges
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner) => (
              <Card key={partner.name} className="p-6 hover:border-primary/50 transition-all hover:shadow-xl hover:scale-105 bg-gradient-to-br from-card to-card/80">
                <img src={partner.logo} alt={`${partner.name} logo`} className="w-full h-20 object-contain" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                About CryptoVaultageFx
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded with a vision to democratize cryptocurrency trading, CryptoVaultageFx has grown to become a trusted platform serving thousands of traders worldwide.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to provide cutting-edge trading tools, expert guidance, and a secure environment for both novice and experienced traders. With over a decade of experience in financial markets and blockchain technology, we combine innovation with reliability.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <h4 className="text-3xl font-bold text-primary">50K+</h4>
                  <p className="text-sm text-muted-foreground mt-2">Active Traders</p>
                </Card>
                <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <h4 className="text-3xl font-bold text-primary">150+</h4>
                  <p className="text-sm text-muted-foreground mt-2">Countries</p>
                </Card>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-3xl"></div>
              <Card className="relative p-8 space-y-6 bg-gradient-to-br from-card to-card/80 backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Security First</h4>
                      <p className="text-sm text-muted-foreground">Bank-grade security with multi-layer encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Expert Team</h4>
                      <p className="text-sm text-muted-foreground">Seasoned professionals with decades of experience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Proven Results</h4>
                      <p className="text-sm text-muted-foreground">Consistent returns and satisfied clients</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Most Common FAQ
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Find answers to frequently asked questions
          </p>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border/40 rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? Our team is here to help you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="p-6 flex items-start gap-4 hover:border-primary/50 transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email Us</h4>
                  <p className="text-muted-foreground">support@cryptovaultagefx.com</p>
                </div>
              </Card>
              <Card className="p-6 flex items-start gap-4 hover:border-primary/50 transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Call Us</h4>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </Card>
              <Card className="p-6 flex items-start gap-4 hover:border-primary/50 transition-all">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Visit Us</h4>
                  <p className="text-muted-foreground">123 Trading Street, Financial District, NY 10004</p>
                </div>
              </Card>
            </div>
            <Card className="p-8 bg-gradient-to-br from-card to-card/80 backdrop-blur">
              <form className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                  <Input type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <Textarea placeholder="Tell us how we can help..." rows={5} />
                </div>
                <Button className="w-full" size="lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Licenses Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <FileCheck className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Licensed & Regulated
            </h2>
            <p className="text-lg text-muted-foreground">
              We operate under strict regulatory compliance to ensure your investments are protected
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {licenses.map((license) => (
              <Card key={license} className="p-6 hover:border-primary/50 transition-all hover:shadow-xl bg-gradient-to-br from-card to-card/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="font-semibold text-foreground text-left">{license}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-2xl">
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
            © 2025 CryptoVaultageFx. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes slide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
