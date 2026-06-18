import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import EmployeeDashboard from './pages/EmployeeDashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ServiceDetail from './pages/ServiceDetail'
import Services from './pages/Services'
import Testimonials from './pages/Testimonials'
import WhyUs from './pages/WhyUs'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
