import { Link } from 'react-router-dom';
import { Percent, Gift, Coffee, ArrowRight } from 'lucide-react';

const PROMOTIONS = [
  {
    id: 1,
    title: '50% Off Party Tacos',
    description: 'Order more than 10 tacos and get 50% discount!',
    conditions: ['Only weekend nights', 'Online payment only'],
    badge: 'up to 50% off',
    badgeColor: 'bg-primary',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop',
    code: 'TACO50',
  },
  {
    id: 2,
    title: 'Free Burrito Upsize',
    description: 'Get a free upsize on any burrito with your lunch order!',
    conditions: ['Lunch hours: 10am - 2pm', 'Delivery orders only'],
    badge: '25% extra',
    badgeColor: 'bg-secondary',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop',
    code: null,
  },
  {
    id: 3,
    title: '100% Cashback on Drinks',
    description: 'Get 100% cashback on drinks when your total bill exceeds $20!',
    conditions: ['Minimum order: $20', 'Online payment only'],
    badge: '100% cashback',
    badgeColor: 'bg-success',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop',
    code: 'DRINKBACK',
  },
];

const SCHEDULE = [
  { time: '7:00 - 9:00', name: 'Breakfast', discount: '10% Off', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { time: '10:00 - 14:00', name: 'Happy Lunch', discount: 'Free Drink', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { time: '15:00 - 17:00', name: 'Afternoon Snack', discount: '20% Off', days: ['Mon', 'Wed', 'Fri', 'Sat'] },
  { time: '18:00 - 21:00', name: 'Happy Dinner', discount: '15% Off', days: ['Tue', 'Thu', 'Sat', 'Sun'] },
];

export default function PromotionsPage() {
  return (
    <div className="bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="heading-accent text-2xl">Special Deals</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-2">Promotions</h1>
          <p className="text-white/80">
            Discover our latest offers and save on your favorite dishes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Promotions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold heading-display text-brown-900 mb-8">
            Featured Offers
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROMOTIONS.map((promo) => (
              <div key={promo.id} className="card overflow-hidden group">
                <div className="relative">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute top-4 left-4 ${promo.badgeColor} text-white font-bold px-4 py-2 rounded-full`}>
                    {promo.badge}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-brown-900 mb-2">{promo.title}</h3>
                  <p className="text-brown-600 mb-4">{promo.description}</p>

                  <ul className="space-y-1 mb-4">
                    {promo.conditions.map((condition, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-brown-500">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {condition}
                      </li>
                    ))}
                  </ul>

                  {promo.code && (
                    <div className="bg-cream rounded-lg p-3 mb-4">
                      <span className="text-xs text-brown-500">Promo Code:</span>
                      <p className="font-mono font-bold text-primary">{promo.code}</p>
                    </div>
                  )}

                  <Link
                    to="/menu"
                    className="btn-primary w-full text-center block"
                  >
                    Claim Offer
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Daily Schedule */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold heading-display text-brown-900 mb-8">
            Daily Special Schedule
          </h2>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Time</th>
                    <th className="px-6 py-4 text-left font-semibold">Special</th>
                    <th className="px-6 py-4 text-left font-semibold">Discount</th>
                    <th className="px-6 py-4 text-center font-semibold hidden sm:table-cell">Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brown-100">
                  {SCHEDULE.map((item, index) => (
                    <tr key={index} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brown-900">{item.time}</td>
                      <td className="px-6 py-4 text-brown-700">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 bg-success/10 text-success font-semibold px-3 py-1 rounded-full text-sm">
                          <Percent className="w-4 h-4" />
                          {item.discount}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                            <span
                              key={day}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                item.days.includes(day)
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-brown-100 text-brown-400'
                              }`}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-primary to-primary-light rounded-3xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Get Exclusive Deals</h3>
                <p className="text-white/80">Subscribe to our newsletter for the latest offers</p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl text-brown-900 placeholder:text-brown-400 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-brown-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brown-800 transition-colors flex items-center gap-2">
                Subscribe
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
