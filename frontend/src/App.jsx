import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css'; 

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="p-mt-5 p-p-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/automatic" element={<Automatic />} />
            <Route path="/manual" element={<Manual />} />
            <Route path="/parts/general" element={<GeneralParts />} />
            <Route path="/parts/special" element={<SpecialParts />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
