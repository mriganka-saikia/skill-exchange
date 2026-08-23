import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, HStack, Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { getMySkillsApi } from "@/api/skills";
import { getMyBookingsApi, getIncomingBookingsApi } from "@/api/bookings";

const StatCard = ({ label, value, to }) => (
    <RouterLink to={to} style={{ textDecoration: "none" }}>
        <Box border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)">
            <Text className="mono-tag" mb={2}>{label}</Text>
            <Heading fontFamily="var(--font-display)" size="2xl" color="var(--ink)">{value}</Heading>
        </Box>
    </RouterLink>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ mySkills: 0, myBookings: 0, incoming: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [skillsRes, bookingsRes, incomingRes] = await Promise.all([
                    getMySkillsApi(),
                    getMyBookingsApi(),
                    getIncomingBookingsApi(),
                ]);
                setStats({
                    mySkills: skillsRes.data.skills.length,
                    myBookings: bookingsRes.data.bookings.length,
                    incoming: incomingRes.data.bookings.filter((b) => b.status === "requested").length,
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const isHelper = user?.role?.includes("helper");

    return (
        <Box className="app-main" py={10}>
            <Heading fontFamily="var(--font-display)" size="xl" mb={1}>
                Hi, {user?.fullName?.split(" ")[0]}
            </Heading>
            <Text color="var(--ink-soft)" mb={8}>
                {isHelper ? "Here's what's happening with your listings and bookings." : "Here's where to find your next skill session."}
            </Text>

            {loading ? (
                <HStack gap={4}>
                    <Skeleton height="100px" flex={1} />
                    <Skeleton height="100px" flex={1} />
                    <Skeleton height="100px" flex={1} />
                </HStack>
            ) : (
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={10}>
                    <StatCard label="My skill listings" value={stats.mySkills} to="/skills/mine" />
                    <StatCard label="My bookings" value={stats.myBookings} to="/bookings/mine" />
                    <StatCard label="Incoming requests" value={stats.incoming} to="/bookings/incoming" />
                </Grid>
            )}

            <VStack align="stretch" gap={4} maxW="480px">
                <RouterLink to="/browse">
                    <Button w="100%" variant="outline" borderColor="var(--line)">Browse skills to book</Button>
                </RouterLink>
                {isHelper && (
                    <RouterLink to="/skills/new">
                        <Button w="100%" bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
                            List a new skill
                        </Button>
                    </RouterLink>
                )}
            </VStack>
        </Box>
    );
};

export default Dashboard;