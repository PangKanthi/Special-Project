import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar/Nav";
import Home from "./Pages/Home";
import Automatic from "./Pages/Automatic";
import Manual from "./Pages/Manual";
import GeneralParts from "./Pages/GeneralParts";
import Repair from "./Pages/Repair";
import About from "./Pages/About";
import Portfolio from "./Pages/Portfolio";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Footer from "./Footer/Foot";
import Homeadmin from "./AdminPages/Homeadmin";
import Navadmin from "./Navbar/Navadmin";
import Manageorders from "./AdminPages/Manageorders";
import Manageproducts from "./AdminPages/Manageproducts";
import Manageusers from "./AdminPages/Manageusers";
import Managerepairrequests from "./AdminPages/Managerepairrequests";
import Manageportfolios from "./AdminPages/Manageportfolios";
import Managedoorprice from "./AdminPages/Managedoorprice";
import History from "./AdminPages/History";
import ShopCart from "./Shopuser/ShopCart";
import ShopOrder from "./Shopuser/ShopOrder";
import ShopOrderinformation from "./Shopuser/ShopOrderinformation";
import ProtectedRoute from "./protectedRoute/protectedRoute";
import Profile from "../src/User Pages/Profile";
import ProductAutoDetail from "./Pagesinside/ProductAutoDetail";
import ResetPassword from "./Pages/PasswordReset/ResetPassword";
import RequestReset from "./Pages/PasswordReset/RequestReset";
import AddAddress from "./Pages/AddAddress";
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";

const App = () => {
  const location = useLocation();
  const isAdminPage =
    location.pathname.startsWith("/homeadmin") ||
    location.pathname.startsWith("/manageorders") ||
    location.pathname.startsWith("/manageproducts") ||
    location.pathname.startsWith("/manageusers") ||
    location.pathname.startsWith("/managerepairrequests") ||
    location.pathname.startsWith("/manageportfolios") ||
    location.pathname.startsWith("/managedoorprice")
    location.pathname.startsWith("/history");

  const showFooter = !["/productAuto/", "/productGeneral/"].some((path) =>
    location.pathname.startsWith(path)
  );

  const bodyStyle = {
    paddingTop: "70px",
  };

  return (
    <div className="App">
      {!isAdminPage && <Navbar />}
      {isAdminPage && <Navadmin />}
      <div className="p-mt-5 p-p-3" style={bodyStyle}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/automatic" element={<Automatic />} />
          <Route path="/productAuto/:id" element={<ProductAutoDetail />} />
          <Route path="/shop-cart/" element={<ShopCart />} />
          <Route path="/shop-order/" element={<ShopOrder />} />
          <Route path="/shop-order-info/" element={<ShopOrderinformation />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/generalparts" element={<GeneralParts />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/requestreset" element={<RequestReset />} />
          <Route path="/add-address" element={<AddAddress />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="U">
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/homeadmin"
            element={
              <ProtectedRoute requiredRole="A">
                <Homeadmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageorders"
            element={
              <ProtectedRoute requiredRole="A">
                <Manageorders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageproducts"
            element={
              <ProtectedRoute requiredRole="A">
                <Manageproducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageusers"
            element={
              <ProtectedRoute requiredRole="A">
                <Manageusers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerepairrequests"
            element={
              <ProtectedRoute requiredRole="A">
                <Managerepairrequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manageportfolios"
            element={
              <ProtectedRoute requiredRole="A">
                <Manageportfolios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managedoorprice"
            element={
              <ProtectedRoute requiredRole="A">
                <Managedoorprice/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute requiredRole="A">
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {showFooter && (
        <div className="pt-8">
          <Footer />
        </div>
      )}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
