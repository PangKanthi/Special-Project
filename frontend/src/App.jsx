import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar/Nav';
import Home from './Pages/Home';
import Automatic from './Pages/Automatic';
import Manual from './Pages/Manual';
import GeneralParts from './Pages/GeneralParts';
import SpecialParts from './Pages/SpecialParts';
import Repair from './Pages/Repair';
import About from './Pages/About';
import Portfolio from './Pages/Portfolio';
import Contact from './Pages/Contact';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Forgotpassword from './Pages/Forgotpassword';
import Footer from './Footer/Foot';
import Homeadmin from './AdminPages/Homeadmin';
import Navadmin from './Navbar/Navadmin';
import Automaticinside from './Pagesinside/Automaticinside';
import GeneralPartsinside from './Pagesinside/GeneralPartsinside';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';
import ShopCart from './Shopuser/ShopCart';
import ShopOrder from './Shopuser/ShopOrder';
import ShopOrderinformation from './Shopuser/ShopOrderinformation';
import ProtectedRoute from './protectedRoute/protectedRoute';


const App = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/homeadmin';
  const bodyStyle = {
    paddingTop: '70px'
  };

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      {!showNavbar && <Navadmin />}
      <div className="p-mt-5 p-p-3" style={bodyStyle}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/automatic" element={<Automatic />} />
          <Route path="/productAuto/:id" element={<Automaticinside />} />
          <Route path="/shop-cart/" element={<ShopCart />} />
          <Route path="/shop-order/" element={<ShopOrder />} />
          <Route path="/shop-order-info/" element={<ShopOrderinformation />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/generalparts" element={<GeneralParts />} />
          <Route path="/productGeneral/:id" element={<GeneralPartsinside />} />
          <Route path="/specialparts" element={<SpecialParts />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/homeadmin" element={<Homeadmin />} />

        </Routes>
      </div>
      <div className="pt-8">
        <Footer />
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
