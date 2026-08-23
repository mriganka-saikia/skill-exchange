import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, HStack, Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import { getIncomingBookingsApi } from "@/api/bookings";
import { getSocket } from "@/lib/socket";

const IncomingRequests = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        getIncomingBookingsApi()
            .then((res) => setBookings(res.data.bookings))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();

        const socket = getSocket();
        if (!socket) return;

        socket.on("bookings:refresh", load);
        return () => socket.off("bookings:refresh", load);
    }, []);
    
    return (
        <Box className="app-main" py={10}>
            <Heading fontFamily="var(--font-display)" size="xl" mb={8}>Incoming requests</Heading>

            {loading ? (
                <VStack gap={3} align="stretch">{[...Array(3)].map((_, i) => <Skeleton key={i} height="70px" borderRadius="8px" />)}</VStack>
            ) : bookings.length === 0 ? (
                <Box textAlign="center" py={16} border="1px dashed var(--line)" borderRadius="10px">
                    <Text fontFamily="var(--font-display)" fontSize="lg" mb={1}>No requests yet</Text>
                    <Text color="var(--ink-soft)" fontSize="sm">Once someone books your listing, it'll show up here.</Text>
                </Box>
            ) : (
                <VStack gap={3} align="stretch">
                    {bookings.map((b) => (
                        <RouterLink key={b._id} to={`/bookings/${b._id}`} style={{ textDecoration: "none" }}>
                            <Box border="1px solid var(--line)" borderRadius="8px" p={4} bg="var(--paper-raised)">
                                <HStack justify="space-between">
                                    <Box>
                                        <Text fontWeight="600">{b.skill?.title}</Text>
                                        <Text fontSize="sm" color="var(--ink-soft)">requested by {b.seeker?.fullName}</Text>
                                    </Box>
                                    <BookingStatusBadge status={b.status} />
                                </HStack>
                            </Box>
                        </RouterLink>
                    ))}
                </VStack>
            )}
        </Box>
    );
};

export default IncomingRequests;
