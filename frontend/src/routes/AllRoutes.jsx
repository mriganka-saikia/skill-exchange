import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BrowseSkills from "@/pages/BrowseSkills";
import SkillDetails from "@/pages/SkillDetails";
import SkillForm from "@/pages/SkillForm";
import MySkills from "@/pages/MySkills";
import MyBookings from "@/pages/MyBookings";
import IncomingRequests from "@/pages/IncomingRequests";
import BookingDetails from "@/pages/BookingDetails";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import FourOFour from "@/pages/FourOFour";
import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthSuccess from "@/pages/OAuthSuccess";
// ...


const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/browse" element={<BrowseSkills />} />
            <Route path="/skills/:id" element={<SkillDetails />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/skills/mine" element={<ProtectedRoute><MySkills /></ProtectedRoute>} />
            <Route path="/skills/new" element={<ProtectedRoute><SkillForm /></ProtectedRoute>} />
            <Route path="/skills/:id/edit" element={<ProtectedRoute><SkillForm /></ProtectedRoute>} />
            <Route path="/bookings/mine" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/bookings/incoming" element={<ProtectedRoute><IncomingRequests /></ProtectedRoute>} />
            <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<FourOFour />} />
        </Routes>
    );
};

export default AllRoutes;