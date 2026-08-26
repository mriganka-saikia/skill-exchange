import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
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
import FourOFour from "@/pages/FourOFour";
import ProtectedRoute from "@/routes/ProtectedRoute";
import OAuthSuccess from "@/pages/OAuthSuccess";

// pulls in Chart.js - only load it when someone actually visits /admin
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

const AdminFallback = () => (
    <Center minH="40vh">
        <Spinner size="lg" color="var(--gold)" />
    </Center>
);

const AllRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/browse" element={<BrowseSkills />} />
            <Route path="/skills/:id" element={<SkillDetails />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/skills/mine" element={<ProtectedRoute><MySkills /></ProtectedRoute>} />
            <Route path="/skills/new" element={<ProtectedRoute><SkillForm /></ProtectedRoute>} />
            <Route path="/skills/:id/edit" element={<ProtectedRoute><SkillForm /></ProtectedRoute>} />
            <Route path="/bookings/mine" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/bookings/incoming" element={<ProtectedRoute><IncomingRequests /></ProtectedRoute>} />
            <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute adminOnly>
                        <Suspense fallback={<AdminFallback />}>
                            <AdminDashboard />
                        </Suspense>
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<FourOFour />} />
        </Routes>
    );
};

export default AllRoutes;