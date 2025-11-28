import {
  Users,
  Heart,
  Shield,
  MessageCircle,
  Wallet,
  Star,
  Compass,
  Search,
  CreditCard,
  UserCheck,
  Globe,
  Sparkles,
  Lock,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Plane,
  ClipboardList,
  BadgeCheck,
  UsersRound,
  Phone,
  Handshake,
  Bell,
  Route,
  LifeBuoy,
  MessageSquare,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF7E0]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-20 lg:py-28">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-3">
              <img 
                src="/Travel_Mate_Logo.png" 
                alt="TravelMate Logo" 
                className="h-12 w-12 object-contain md:h-16 md:w-16 lg:h-20 lg:w-20"
              />
              <span className="text-2xl font-bold text-[#2CA4BC] md:text-3xl lg:text-4xl">TravelMate</span>
            </div>
            <h1 className="mb-4 max-w-4xl text-3xl font-bold tracking-tight text-[#1B1B1B] md:mb-6 md:text-4xl lg:text-5xl xl:text-6xl">
              Travel with strangers, create memories, and give back through volunteering.
            </h1>
            <p className="mb-6 max-w-2xl text-base text-[#4A4A4A] md:mb-8 md:text-lg lg:text-xl">
              TravelMate connects solo travelers with like-minded adventurers for group trips that
              combine exploration with meaningful community impact.
            </p>
            <button className="flex items-center gap-2 rounded-lg bg-[#2CA4BC] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#2593A8] md:px-8 md:py-3.5 md:text-lg">
              Start Your Journey
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="h-px bg-[#D4C5A0]" />
      </div>

      {/* Our Mission */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-[#2CA4BC] md:mb-6 md:text-3xl lg:text-4xl">Our Mission</h2>
            <div className="space-y-4 text-[#4A4A4A]">
              <p className="text-base leading-relaxed md:text-lg">
                TravelMate was built with a simple belief: travel is better together. We help solo
                travelers find like-minded co-travelers, reducing the loneliness of exploring alone
                while promoting responsible tourism.
              </p>
              <p className="text-base leading-relaxed md:text-lg">
                Beyond just connecting travelers, we're committed to supporting local
                communities through volunteering opportunities. Every trip is a chance to explore,
                connect, and give back.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="rounded-xl bg-white p-4 shadow-sm md:p-6">
              <Users className="mb-2 h-6 w-6 text-[#2CA4BC] md:mb-3 md:h-8 md:w-8" />
              <h3 className="text-sm font-semibold text-[#1B1B1B] md:text-base">Community First</h3>
              <p className="mt-1 text-xs text-[#4A4A4A] md:text-sm">
                Building connections that last beyond the trip
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm md:p-6">
              <Heart className="mb-2 h-6 w-6 text-[#2CA4BC] md:mb-3 md:h-8 md:w-8" />
              <h3 className="text-sm font-semibold text-[#1B1B1B] md:text-base">Give Back</h3>
              <p className="mt-1 text-xs text-[#4A4A4A] md:text-sm">
                Meaningful volunteering at every destination
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm md:p-6">
              <Globe className="mb-2 h-6 w-6 text-[#2CA4BC] md:mb-3 md:h-8 md:w-8" />
              <h3 className="text-sm font-semibold text-[#1B1B1B] md:text-base">Explore Responsibly</h3>
              <p className="mt-1 text-xs text-[#4A4A4A] md:text-sm">Sustainable tourism practices</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm md:p-6">
              <Sparkles className="mb-2 h-6 w-6 text-[#2CA4BC] md:mb-3 md:h-8 md:w-8" />
              <h3 className="text-sm font-semibold text-[#1B1B1B] md:text-base">Create Memories</h3>
              <p className="mt-1 text-xs text-[#4A4A4A] md:text-sm">Unforgettable shared experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* How TravelMate Works */}
      <section className="bg-white/40">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
          <div className="mb-10 text-center md:mb-14 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-[#2CA4BC] md:mb-4 md:text-3xl lg:text-4xl">
              How TravelMate Works
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-[#4A4A4A] md:text-base">
              Getting started is simple. Here's how you can join your next adventure in just a
              few steps.
            </p>
          </div>

          {/* Travel Packages Sub-section */}
          <div className="mb-12 md:mb-14 lg:mb-16">
            <div className="mb-6 flex flex-col items-center justify-center gap-2 md:mb-8 md:flex-row md:gap-3">
              <Plane className="h-6 w-6 text-[#2CA4BC] md:h-7 md:w-7" />
              <h3 className="text-center text-xl font-bold text-[#1B1B1B] md:text-2xl">
                Travel Packages — Explore, Connect & Contribute
              </h3>
            </div>
            <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-[#4A4A4A] md:mb-10 md:text-base">
              TravelMate makes solo travel social, safe, and meaningful.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {[
                {
                  step: 1,
                  icon: Search,
                  title: "Discover Trips You Love",
                  description:
                    "Browse curated travel and volunteering packages from trusted agencies.",
                },
                {
                  step: 2,
                  icon: ClipboardList,
                  title: "Easy Application Process",
                  description: "Fill in your travel details and any special requests.",
                },
                {
                  step: 3,
                  icon: CreditCard,
                  title: "Pay a Small Refundable Advance",
                  description:
                    "Once approved by the agency, confirm your spot with a refundable advance amount.",
                },
                {
                  step: 4,
                  icon: UsersRound,
                  title: "Join a Verified Travel Group",
                  description:
                    "Automatically get grouped with other approved travelers going to the same trip.",
                },
                {
                  step: 5,
                  icon: Phone,
                  title: "Connect Before the Journey",
                  description:
                    "Use group chat and calls to bond, exchange tips, and plan together.",
                },
                {
                  step: 6,
                  icon: Handshake,
                  title: "Travel, Explore & Give Back",
                  description:
                    "Enjoy the trip with new friends while taking part in community volunteering activities.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative flex flex-col rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
                >
                  <div className="mb-3 flex items-center gap-3 md:mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2CA4BC] text-white md:h-10 md:w-10">
                      <span className="text-xs font-bold md:text-sm">{item.step}</span>
                    </div>
                    <item.icon className="h-5 w-5 text-[#2CA4BC] md:h-6 md:w-6" />
                  </div>
                  <h4 className="mb-2 text-sm font-semibold text-[#1B1B1B] md:text-base">{item.title}</h4>
                  <p className="text-xs text-[#4A4A4A] md:text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider between sub-sections */}
          <div className="mx-auto mb-12 max-w-md md:mb-14 lg:mb-16">
            <div className="h-px bg-[#D4C5A0]" />
          </div>

          {/* Local Guide Feature Sub-section */}
          <div>
            <div className="mb-6 flex flex-col items-center justify-center gap-2 md:mb-8 md:flex-row md:gap-3">
              <BadgeCheck className="h-6 w-6 text-[#2CA4BC] md:h-7 md:w-7" />
              <h3 className="text-center text-xl font-bold text-[#1B1B1B] md:text-2xl">
                Local Guide Feature — Travel with Confidence
              </h3>
            </div>
            <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-[#4A4A4A] md:mb-10 md:text-base">
              Guides ensure your experience remains safe and well-organized.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-5">
              {[
                {
                  step: 1,
                  icon: UserCheck,
                  title: "Verified Local Guides",
                  description: "Assigned professionals who manage and lead your group.",
                },
                {
                  step: 2,
                  icon: Bell,
                  title: "Real-Time Alerts",
                  description:
                    "Guides share updates, schedules, warnings, and checkpoints instantly.",
                },
                {
                  step: 3,
                  icon: Route,
                  title: "Itinerary Management",
                  description:
                    "Guides ensure the group stays together and follows the plan smoothly.",
                },
                {
                  step: 4,
                  icon: LifeBuoy,
                  title: "On-Trip Support",
                  description:
                    "Immediate assistance for navigation, emergencies, and local insights.",
                },
                {
                  step: 5,
                  icon: MessageSquare,
                  title: "Traveler Feedback",
                  description: "Guides are reviewed by travelers to maintain trust and quality.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center rounded-xl bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md md:p-6"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2CA4BC]/10 md:mb-4 md:h-14 md:w-14">
                    <item.icon className="h-6 w-6 text-[#2CA4BC] md:h-7 md:w-7" />
                  </div>
                  <span className="mb-1 text-xs font-medium text-[#2CA4BC] md:mb-2">Step {item.step}</span>
                  <h4 className="mb-2 text-sm font-semibold text-[#1B1B1B] md:text-base">{item.title}</h4>
                  <p className="text-xs text-[#4A4A4A] md:text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-8 text-center md:mb-10 lg:mb-12">
          <h2 className="mb-3 text-2xl font-bold text-[#2CA4BC] md:mb-4 md:text-3xl lg:text-4xl">
            Why Choose TravelMate
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-[#4A4A4A] md:text-base">
            Everything you need for a safe, meaningful, and memorable travel experience.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Safe & Verified Groups",
              description:
                "All travelers undergo verification. Travel with peace of mind knowing everyone is vetted.",
            },
            {
              icon: Heart,
              title: "Volunteer Activities Included",
              description:
                "Every trip includes opportunities to give back through meaningful community activities.",
            },
            {
              icon: MessageCircle,
              title: "Group Chat & Calls",
              description:
                "Connect with your travel group before, during, and after your trip with in-app communication.",
            },
            {
              icon: Compass,
              title: "Travel Tips & Recommendations",
              description:
                "Get insider tips from local guides and fellow travelers for authentic experiences.",
            },
            {
              icon: Wallet,
              title: "In-App Wallet & Secure Payments",
              description:
                "Manage your trip finances securely with our integrated wallet and payment system.",
            },
            {
              icon: Star,
              title: "Ratings & Reviews",
              description:
                "Read and write reviews for trips, guides, and agencies to help the community.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#D4C5A0]/50 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
            >
              <feature.icon className="mb-3 h-8 w-8 text-[#2CA4BC] md:mb-4 md:h-10 md:w-10" />
              <h3 className="mb-2 text-base font-semibold text-[#1B1B1B] md:text-lg">{feature.title}</h3>
              <p className="text-sm text-[#4A4A4A] md:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
        <div className="mb-8 text-center md:mb-10 lg:mb-12">
          <h2 className="mb-3 text-2xl font-bold text-[#2CA4BC] md:mb-4 md:text-3xl lg:text-4xl">Trust & Safety</h2>
          <p className="mx-auto max-w-2xl text-sm text-[#4A4A4A] md:text-base">
            Your safety is our top priority. We've built multiple layers of protection into
            every aspect of your journey.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {[
            {
              icon: UserCheck,
              title: "Verified Users",
              description: "Identity verification for all travelers and guides",
            },
            {
              icon: Shield,
              title: "Guide Monitoring",
              description: "Real-time tracking and communication with trip leaders",
            },
            {
              icon: RefreshCw,
              title: "Transparent Refunds",
              description: "Clear refund policies with hassle-free processing",
            },
            {
              icon: Lock,
              title: "Secure Transactions",
              description: "Bank-level encryption for all payments",
            },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#2CA4BC]/10 md:mb-4 md:h-14 md:w-14">
                <item.icon className="h-6 w-6 text-[#2CA4BC] md:h-7 md:w-7" />
              </div>
              <h3 className="mb-2 text-sm font-semibold text-[#1B1B1B] md:text-base">{item.title}</h3>
              <p className="text-xs text-[#4A4A4A] md:text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="h-px bg-[#D4C5A0]" />
      </div>

      {/* Our Story */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#2CA4BC] md:mb-6 md:text-3xl lg:text-4xl">Our Story</h2>
          <div className="space-y-4 text-base leading-relaxed text-[#4A4A4A] md:text-lg">
            <p>
              TravelMate was born from a simple frustration: solo travel is often expensive, lonely,
              and sometimes unsafe. Our founders experienced firsthand the challenges of exploring
              the world alone—the high costs of single-traveler supplements, the isolation of dining
              alone, and the missed opportunities for deeper cultural connections.
            </p>
            <p>
              We envisioned a platform where solo travelers could find their tribe, share costs, and
              create unforgettable memories together. But we wanted more than just a travel matching
              service. We wanted to build something meaningful—a community that not only explores
              the world but also gives back to it.
            </p>
            <p>
              Today, TravelMate connects thousands of travelers across the globe, turning strangers
              into friends and trips into transformative experiences. Every journey is an
              opportunity to explore, connect, and make a positive impact.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-white/40">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
          <div className="mb-8 text-center md:mb-10 lg:mb-12">
            <h2 className="mb-3 text-2xl font-bold text-[#2CA4BC] md:mb-4 md:text-3xl lg:text-4xl">Meet the Team</h2>
            <p className="mx-auto max-w-2xl text-sm text-[#4A4A4A] md:text-base">
              The passionate people behind TravelMate who are dedicated to making travel more social
              and meaningful.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {[
              {
                name: "Sourav k",
                role: "Founder & CEO",
                bio: "Former solo traveler turned community builder",
                avatar: "SK",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md md:h-24 md:w-24">
                  <img
                    src={'https://res.cloudinary.com/dwwg5ot0u/image/upload/v1764366921/_DSC7261_mtvhit.jpg'}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-base font-semibold text-[#1B1B1B] md:text-lg">{member.name}</h3>
                <p className="text-sm font-medium text-[#2CA4BC]">{member.role}</p>
                <p className="mt-2 text-xs text-[#4A4A4A] md:text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2CA4BC] text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-12 md:py-16 lg:py-20">
          <div className="flex flex-col items-center text-center">
            <img 
                src="/Travel_Mate_Logo.png" 
                alt="TravelMate Logo" 
                className="h-12 w-12 object-contain md:h-16 md:w-16 lg:h-20 lg:w-20"
              />
            <h2 className="mb-3 text-2xl font-bold md:mb-4 md:text-3xl lg:text-4xl">Ready to Start Your Journey?</h2>
            <p className="mb-6 max-w-2xl text-sm text-white/90 md:mb-8 md:text-base lg:text-lg">
              Join thousands of travelers who have discovered the joy of exploring together. Your
              next adventure and new friends are just a click away.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-[#2CA4BC] transition-colors hover:bg-white/90 md:text-base">
                <Search className="h-4 w-4" />
                Explore Trips
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 md:text-base">
                <Users className="h-4 w-4" />
                Join the Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4C5A0] bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-6 md:py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#2CA4BC]" />
              <span className="font-semibold text-[#1B1B1B]">TravelMate</span>
            </div>
            <p className="text-xs text-[#4A4A4A] md:text-sm">
              © 2025 TravelMate. Making travel social and meaningful.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}