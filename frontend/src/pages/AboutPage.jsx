import { Link } from 'react-router-dom';
import { ChefHat, ArrowRight, Users, Award, Clock, Globe } from 'lucide-react';

const TEAM_PHOTOS = [
  {
    name: 'Chef Maria Rodriguez',
    role: 'Head Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop',
  },
  {
    name: 'Chef Carlos Mendez',
    role: 'Grill Master',
    image: 'https://images.unsplash.com/photo-1583394293214-28ez1e51a97d?w=400&h=400&fit=crop',
  },
  {
    name: 'Chef Ana Garcia',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&h=400&fit=crop',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative bg-brown-900 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=800&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="heading-accent text-2xl">Our Story</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              About <span className="text-primary">QFood</span>
            </h1>
            <p className="text-lg text-brown-300 leading-relaxed">
              Founded in 2002 by Chef Quang, QFood has been serving authentic Mexican cuisine 
              with passion and dedication. What started as a small family restaurant has grown 
              into a beloved destination for food enthusiasts across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="heading-accent text-xl">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2 mb-6">
                Bringing People Together Through Food
              </h2>
              <p className="text-brown-600 leading-relaxed mb-6">
                We believe that great food has the power to create lasting memories and bring 
                people together. Every dish we prepare is made with love, using the freshest 
                ingredients and traditional recipes passed down through generations.
              </p>
              <p className="text-brown-600 leading-relaxed mb-8">
                From our signature tacos to our mouthwatering burritos, each item on our menu 
                represents our commitment to authenticity, quality, and customer satisfaction.
              </p>
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2">
                Explore Our Menu
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary/10 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-primary">20+</span>
                  <p className="text-brown-600 mt-1">Years of Experience</p>
                </div>
                <div className="bg-secondary/10 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-secondary">50+</span>
                  <p className="text-brown-600 mt-1">Menu Items</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-brown-100 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-brown-700">100K+</span>
                  <p className="text-brown-600 mt-1">Happy Customers</p>
                </div>
                <div className="bg-success/10 rounded-2xl p-6 text-center">
                  <span className="text-4xl font-bold text-success">4.9</span>
                  <p className="text-brown-600 mt-1">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">What We Believe</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              Our Core Values
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Community',
                description: 'Building connections through shared dining experiences',
              },
              {
                icon: Award,
                title: 'Quality',
                description: 'Using only the finest, freshest ingredients',
              },
              {
                icon: Clock,
                title: 'Tradition',
                description: 'Honoring authentic Mexican cooking methods',
              },
              {
                icon: Globe,
                title: 'Growth',
                description: 'Constantly innovating while staying true to our roots',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-brown-900 mb-2">{value.title}</h3>
                <p className="text-sm text-brown-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="heading-accent text-xl">Meet Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold heading-display mt-2">
              The People Behind the Magic
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_PHOTOS.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-lg text-brown-900">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <ChefHat className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience QFood?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join us for an unforgettable culinary journey through the flavors of Mexico
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-cream transition-colors">
              Order Online
            </Link>
            <Link to="/table-booking" className="bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors">
              Book a Table
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
