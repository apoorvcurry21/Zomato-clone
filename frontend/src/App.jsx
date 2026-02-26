import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantMenu from './pages/RestaurantMenu';
import Checkout from './pages/Checkout';
import CartWidget from './components/CartWidget';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurant/:id" element={<RestaurantMenu />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Future routes for Profile, Orders, etc. */}
          </Routes>
        </main>
        <CartWidget />
      </div>
    </Router>
  );
}

export default App;
