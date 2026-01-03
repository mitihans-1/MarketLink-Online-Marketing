import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <header style={{ background: '#333', color: 'white', padding: '1rem' }}>
        <nav>
          <a href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</a>
          <a href="/products" style={{ color: 'white', marginRight: '1rem' }}>Products</a>
          <a href="/cart" style={{ color: 'white' }}>Cart</a>
        </nav>
      </header>
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
      <footer style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
        <p>&copy; 2024 MarketPlace</p>
      </footer>
    </div>
  );
};

export default MainLayout;
