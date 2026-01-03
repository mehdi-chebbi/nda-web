import { useState, useEffect } from 'react';
import Card from '../components/Card';
import ImageComparisonSlider from '../components/ImageComparisonSlider';

const StatCard = ({ value, label, icon }: { value: string; label: string; icon: string }) => (
  <div className="bg-white p-6 rounded-xl border-2 border-primary/20 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:border-primary/40">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-bold text-primary mb-1">{value}</div>
    <div className="text-sm text-text-secondary font-medium">{label}</div>
  </div>
);

const ImpactCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="group bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-secondary/30 hover:shadow-xl transition-all duration-300">
    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="font-heading font-semibold text-xl text-primary mb-2">{title}</h3>
    <p className="font-body text-text-secondary leading-relaxed">{description}</p>
  </div>
);

const SustainableDevelopment = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header with Animation */}
        <div className={`mb-16 text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold text-sm tracking-wide uppercase">
              🌍 Climate Action Now
            </span>
          </div>
          <h1 className="font-heading font-bold text-5xl md:text-6xl text-primary mb-4 leading-tight">
            Sustainable Development
          </h1>
          <p className="font-body text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            We're not just talking about change—we're making it happen. Together, we're building a future where our communities thrive, not just survive.
          </p>
        </div>

        {/* Stats Section */}
        <div className={`mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-3xl text-primary mb-3">
              Look at What We've Already Accomplished! 🎯
            </h2>
            <p className="font-body text-text-secondary text-lg max-w-3xl mx-auto">
              These aren't just numbers—they represent real families, real communities, and real hope. 
              And we're just getting started! Every project we launch, every life we touch, every tree 
              we plant is a victory against climate change. This is proof that when we come together 
              with purpose and determination, we can move mountains.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard value="15+" label="Active Projects" icon="🌱" />
            <StatCard value="50K+" label="Lives Impacted" icon="👥" />
            <StatCard value="200K+" label="Trees Planted" icon="🌳" />
          </div>
        </div>

        {/* Climate Change Reality Section */}
        <section className={`mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="p-8 md:p-12 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-8 text-center">
                Climate Change is{' '}
                <span className="text-secondary animate-pulse">
                  REAL
                </span>
              </h2>

              {/* Reality Check */}
              <div className="max-w-4xl mx-auto mb-12">
                <p className="font-body text-text-secondary text-lg leading-relaxed mb-6">
                  Look around—the evidence is everywhere. Severe droughts. Coastal erosion. Deforestation. 
                  Disappearing water sources. These aren't just statistics or distant warnings—this is happening 
                  RIGHT NOW to our land, our neighbors, our children's future. But here's the thing: we're not 
                  sitting back and watching it happen.
                </p>

                <p className="font-body text-text-secondary text-lg leading-relaxed mb-6">
                  The science is crystal clear. The impacts are undeniable. Our climate is changing faster than 
                  ever before, and the most vulnerable communities are bearing the brunt of it. We've seen crops 
                  fail. We've watched water sources dry up. We've witnessed families struggle as their traditional 
                  ways of life become impossible to maintain. This is the harsh reality of climate change in Eritrea.
                </p>

                {/* Mission Statement */}
                <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-xl shadow-md">
                  <p className="font-body text-text-primary text-lg leading-relaxed font-medium mb-4">
                    💪 We're FIGHTERS, not victims. Eritrea's National Designated Authority is on the front lines 
                    every single day—launching resilience projects, driving sustainable development, forging powerful 
                    partnerships. We're reclaiming our land. We're protecting what matters. And we're building a future 
                    that our grandchildren will be proud of. This is OUR moment. This is OUR fight. And together? 
                    We're unstoppable.
                  </p>
                  <p className="font-body text-text-primary text-lg leading-relaxed font-medium">
                    Every single person in Eritrea has a role to play in this transformation. Whether you're a farmer 
                    adopting new techniques, a community leader mobilizing neighbors, a student learning about climate 
                    solutions, or a supporter spreading the word—you matter. Your actions ripple outward, creating waves 
                    of change that will reshape our nation's future. We're not just adapting to climate change; we're 
                    pioneering solutions that the whole world can learn from!
                  </p>
                </div>
              </div>

              {/* Image Comparison */}
              <div className="max-w-5xl mx-auto mb-12">
                <h3 className="font-heading font-semibold text-2xl md:text-3xl text-primary mb-4 text-center">
                  🏔️ Highlands: From Drought to Recovery
                </h3>
                <p className="font-body text-text-secondary text-center mb-8 max-w-3xl mx-auto leading-relaxed">
                  See it with your own eyes! Drag the slider and watch how dedication and action transformed 
                  devastated highlands into thriving ecosystems. If we did this, imagine what else we can do together!
                </p>
                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                  <ImageComparisonSlider />
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 text-center">
                <p className="font-heading font-semibold text-2xl text-primary mb-2">
                  Ready to Be Part of Something BIGGER?
                </p>
                <p className="font-body text-text-secondary text-lg mb-4">
                  Every single action matters. Every person counts. Join us and let's make history together! 🚀
                </p>
                <p className="font-body text-text-secondary mb-8 max-w-3xl mx-auto">
                  The journey to a climate-resilient Eritrea isn't easy, but nothing worth fighting for ever is. 
                  We've already proven what's possible—now it's time to scale up, reach further, and impact more lives. 
                  Whether you want to get involved directly, support our projects, or simply learn more about what 
                  we're doing, there's a place for you in this movement. Don't wait for change—BE the change!
                </p>
                <a
                  href="/resources"
                  className="inline-block bg-primary text-white px-10 py-4 rounded-full font-body font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Let's Do This! See Our Projects →
                </a>
              </div>
            </div>
          </Card>
        </section>

        {/* Impact Areas */}
        <section className={`mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
              Our Impact Areas: Where We're Making Magic Happen ✨
            </h2>
            <p className="font-body text-text-secondary text-lg max-w-4xl mx-auto leading-relaxed">
              Climate change is complex, but our response is clear and powerful. We're attacking this 
              challenge from every angle—water, agriculture, and community strength. Each area reinforces 
              the others, creating a web of resilience that gets stronger every single day. This isn't 
              just about surviving climate change; it's about building a future where Eritrea leads the 
              way in sustainable development!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImpactCard
              icon="💧"
              title="Water Conservation"
              description="We're not letting our communities go thirsty! Our sustainable water systems are turning the tide on drought—bringing life-giving water security to families who need it most."
            />
            <ImpactCard
              icon="🌾"
              title="Sustainable Agriculture"
              description="Our farmers are climate warriors! We're empowering them with smart farming techniques that don't just survive climate change—they THRIVE through it. Food security? We're making it happen."
            />
            <ImpactCard
              icon="🏘️"
              title="Community Resilience"
              description="Strong communities = unstoppable future! We're building the capacity, infrastructure, and spirit our people need to face climate challenges head-on and come out winning."
            />
          </div>
        </section>

        {/* Building Resilient Communities */}
        <section className={`mb-16 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Card className="p-8 md:p-12 bg-gradient-to-br from-white to-primary/5">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">🤝</div>
              <div>
                <h2 className="font-heading font-semibold text-3xl text-primary mb-4">
                  We're Stronger Together! 💪
                </h2>
                <p className="font-body text-text-secondary text-lg leading-relaxed">
                  Real change doesn't happen alone. We're bringing together governments, international partners, 
                  and local heroes to create something incredible. This is how we win—together, united, unstoppable. 
                  Our collaborative spirit is turning climate finance and strategic partnerships into real, tangible 
                  change that you can see and feel.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-secondary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-heading font-semibold text-xl text-primary mb-3">🎯 Strategic Partnerships</h3>
                <p className="font-body text-text-secondary">
                  We're joining forces with international organizations and local champions to multiply our impact. 
                  When we work together, nothing is impossible!
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-secondary hover:shadow-lg transition-shadow duration-300">
                <h3 className="font-heading font-semibold text-xl text-primary mb-3">💰 Climate Finance</h3>
                <p className="font-body text-text-secondary">
                  We're securing the funding to fuel real change. Every dollar goes straight to the front lines—
                  protecting communities, restoring ecosystems, building futures!
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default SustainableDevelopment;