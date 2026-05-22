import './App.css'

const featuredFoods = [
  {
    name: 'Truffle Beef Pasta',
    description: 'Slow-braised beef, mushroom cream, parmesan',
    price: '$18',
    accent: 'pasta',
  },
  {
    name: 'Citrus Salmon Bowl',
    description: 'Grilled salmon, jasmine rice, pickled vegetables',
    price: '$16',
    accent: 'salmon',
  },
  {
    name: 'Charred Garden Plate',
    description: 'Seasonal vegetables, herb oil, toasted seeds',
    price: '$13',
    accent: 'garden',
  },
]

const stats = [
  ['25 min', 'Average pickup'],
  ['4.8/5', 'Guest rating'],
  ['40+', 'Menu items'],
]

function App() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="/">
          Maison Plate
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="/menu">Menu</a>
          <a href="/booking">Booking</a>
          <a href="/orders">Orders</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <section className="hero-section" aria-label="Restaurant homepage">
        <div className="hero-copy">
          <p className="eyebrow">Fresh kitchen. Fast ordering.</p>
          <h1>Restaurant Ordering System</h1>
          <p className="hero-text">
            Browse signature dishes, reserve a table, or send an order straight
            to the kitchen from one clean experience.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/menu">
              View menu
            </a>
            <a className="button secondary" href="/booking">
              Book a table
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="plate">
            <span className="leaf leaf-one"></span>
            <span className="leaf leaf-two"></span>
            <span className="leaf leaf-three"></span>
            <span className="sauce"></span>
            <span className="main-bite"></span>
          </div>
          <div className="order-ticket">
            <span>Ready now</span>
            <strong>Table 08</strong>
          </div>
        </div>
      </section>

      <section className="quick-panel" aria-label="Restaurant highlights">
        {stats.map(([value, label]) => (
          <div className="stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="menu-preview" aria-labelledby="featured-title">
        <div className="section-heading">
          <p className="eyebrow">Today&apos;s picks</p>
          <h2 id="featured-title">Featured menu</h2>
        </div>

        <div className="food-grid">
          {featuredFoods.map((food) => (
            <article className="food-card" key={food.name}>
              <div className={`food-art ${food.accent}`} aria-hidden="true">
                <span></span>
              </div>
              <div>
                <h3>{food.name}</h3>
                <p>{food.description}</p>
              </div>
              <strong>{food.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band" aria-label="Start ordering">
        <div>
          <p className="eyebrow">Dinner made simple</p>
          <h2>Order ahead or reserve your seat.</h2>
        </div>
        <div className="cta-actions">
          <a className="button primary" href="/cart">
            Open cart
          </a>
          <a className="button secondary" href="/admin">
            Admin
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
