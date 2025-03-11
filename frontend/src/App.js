import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // Importa HelmetProvider per il contesto globale
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/Home.css";

// Lazy loading per migliorare le performance
const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const EventiPassati = lazy(() => import("./pages/PastEvents"));
const About = lazy(() => import("./pages/About"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EventDetails = lazy(() => import("./components/EventDetails"));
const EventList = lazy(() => import("./components/EventList"));
const Merch = lazy(() => import("./pages/Merch"));

function App() {
  return (
    <HelmetProvider> {/* Provider globale per gestire i meta tag dinamici */}
      <Router>
        <div id="root">
          <Navbar /> {/* Navbar visibile su tutte le pagine */}

          <div className="main-content">
            {/* Suspense per gestire il caricamento delle pagine lazy */}
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} >
                  <Route path="create-event" element={<CreateEvent />} />
                </Route>
                <Route path="/events" element={<Events />} />
                <Route path="/eventi/:id" element={<EventDetails />} />
                <Route path="/past-events" element={<EventiPassati />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>
          </div>

          <Footer /> {/* Footer visibile su tutte le pagine */}
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;