import { useEffect, useState } from "react";
import { Box, Button, Grid, HStack, Heading, Skeleton, Tabs, Text, VStack } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { getPendingSkillsApi, verifySkillApi, getAllUsersApi, getReportsApi } from "@/api/admin";
import { toaster } from "@/components/ui/toaster";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const AdminDashboard = () => {
    const [pending, setPending] = useState([]);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [pendingRes, usersRes, reportsRes] = await Promise.all([
                getPendingSkillsApi(),
                getAllUsersApi({ limit: 20 }),
                getReportsApi(),
            ]);
            setPending(pendingRes.data.skills);
            setUsers(usersRes.data.users);
            setReports(reportsRes.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const handleVerify = async (id, decision) => {
        setBusyId(id);
        try {
            await verifySkillApi(id, decision);
            toaster.create({ title: `Listing ${decision}`, type: "success" });
            setPending((prev) => prev.filter((s) => s._id !== id));
        } catch {
            toaster.create({ title: "Could not update listing", type: "error" });
        } finally {
            setBusyId(null);
        }
    };

    if (loading) return <Box className="app-main" py={10}><Skeleton height="300px" /></Box>;

    const categoryLabels = reports?.skillsByCategory?.map((c) => c._id) || [];
    const categoryCounts = reports?.skillsByCategory?.map((c) => c.count) || [];

    return (
        <Box className="app-main" py={10}>
            <Heading fontFamily="var(--font-display)" size="xl" mb={8}>Admin dashboard</Heading>

            <Tabs.Root defaultValue="verify">
                <Tabs.List mb={6}>
                    <Tabs.Trigger value="verify">Verification queue ({pending.length})</Tabs.Trigger>
                    <Tabs.Trigger value="users">Users ({users.length})</Tabs.Trigger>
                    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="verify">
                    {pending.length === 0 ? (
                        <Text color="var(--ink-soft)">Nothing waiting for review.</Text>
                    ) : (
                        <VStack align="stretch" gap={3}>
                            {pending.map((skill) => (
                                <Box key={skill._id} border="1px solid var(--line)" borderRadius="8px" p={4} bg="var(--paper-raised)">
                                    <HStack justify="space-between" flexWrap="wrap" gap={3}>
                                        <Box>
                                            <Text fontWeight="600">{skill.title}</Text>
                                            <Text fontSize="sm" color="var(--ink-soft)">{skill.category} · by {skill.helper?.fullName}</Text>
                                            <Text fontSize="sm" color="var(--ink-soft)" mt={1} maxW="480px">{skill.description}</Text>
                                        </Box>
                                        <HStack gap={2}>
                                            <Button size="sm" bg="var(--teal)" color="white" loading={busyId === skill._id} onClick={() => handleVerify(skill._id, "approved")}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="outline" borderColor="var(--rust)" color="var(--rust)" loading={busyId === skill._id} onClick={() => handleVerify(skill._id, "rejected")}>
                                                Reject
                                            </Button>
                                        </HStack>
                                    </HStack>
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Tabs.Content>

                <Tabs.Content value="users">
                    <VStack align="stretch" gap={2}>
                        {users.map((u) => (
                            <HStack key={u._id} justify="space-between" border="1px solid var(--line)" borderRadius="8px" p={3}>
                                <Box>
                                    <Text fontWeight="600" fontSize="sm">{u.fullName}</Text>
                                    <Text fontSize="xs" color="var(--ink-soft)">{u.email}</Text>
                                </Box>
                                <Text className="mono-tag">{(u.role || []).join(", ")}</Text>
                            </HStack>
                        ))}
                    </VStack>
                </Tabs.Content>

                <Tabs.Content value="reports">
                    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={8}>
                        <Box border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)">
                            <Text className="mono-tag" mb={2}>Total users</Text>
                            <Heading fontFamily="var(--font-display)">{reports?.totalUsers}</Heading>
                        </Box>
                        {reports?.skillsByStatus?.map((s) => (
                            <Box key={s._id} border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)">
                                <Text className="mono-tag" mb={2} textTransform="capitalize">{s._id} listings</Text>
                                <Heading fontFamily="var(--font-display)">{s.count}</Heading>
                            </Box>
                        ))}
                    </Grid>

                    {categoryLabels.length > 0 && (
                        <Box border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)" maxW="560px">
                            <Text className="mono-tag" mb={4}>Approved listings by category</Text>
                            <Bar
                                data={{
                                    labels: categoryLabels,
                                    datasets: [{ data: categoryCounts, backgroundColor: "#c8961e", borderRadius: 4 }],
                                }}
                                options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }}
                            />
                        </Box>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    );
};

export default AdminDashboard;