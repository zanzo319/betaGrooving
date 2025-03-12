import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/Home.css";

// Lazy loading per migliorare le performance
const Home = lazy(() => import("./pages/Home"));
const Events = lazy(() => import("./pages/Events"));
const EventiPassati = lazy(() => import("./pages/PastEvents"));
const About = lazy(() => import("./pages/About"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const ListEvent = lazy(() => import("./pages/ListEvent"));
const EditEvent = lazy(() => import("./pages/EditEvent"));
const EventDetails = lazy(() => import("./components/EventDetails"));
const Merch = lazy(() => import("./pages/Merch"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div id="root">
          <Navbar />

          <div className="main-content">
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <Routes>
                {/* Rotte pubbliche */}
                <Route path="/" element={<Home />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/events" element={<Events />} />
                <Route path="/eventi/:id" element={<EventDetails />} />
                <Route path="/past-events" element={<EventiPassati />} />
                <Route path="/merch" element={<Merch />} />
                <Route path="/about" element={<About />} />

                {/* Rotte protette */}
                <Route
                  path="/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard/create-event"
                  element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard/edit-event/:id"
                  element={
                    <ProtectedRoute>
                      <EditEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin-dashboard/event-list"
                  element={
                    <ProtectedRoute>
                      <ListEvent />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </div>

          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;