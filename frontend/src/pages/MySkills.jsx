import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Badge, Box, Button, HStack, Heading, Skeleton, Text, VStack } from "@chakra-ui/react";
import { getMySkillsApi, deleteSkillApi } from "@/api/skills";
import { toaster } from "@/components/ui/toaster";

const STATUS_COLOR = {
    pending: { bg: "rgba(200,150,30,0.15)", color: "var(--gold-deep)" },
    approved: { bg: "rgba(47,111,98,0.15)", color: "var(--teal)" },
    rejected: { bg: "rgba(182,82,47,0.12)", color: "var(--rust)" },
};

const MySkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getMySkillsApi();
            setSkills(res.data.skills);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSkillApi(id);
            toaster.create({ title: "Listing deleted", type: "success" });
            load();
        } catch {
            toaster.create({ title: "Could not delete listing", type: "error" });
        }
    };

    return (
        <Box className="app-main" py={10}>
            <HStack justify="space-between" mb={8}>
                <Heading fontFamily="var(--font-display)" size="xl">My skill listings</Heading>
                <RouterLink to="/skills/new">
                    <Button bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>New listing</Button>
                </RouterLink>
            </HStack>

            {loading ? (
                <VStack gap={3} align="stretch">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} height="80px" borderRadius="8px" />)}
                </VStack>
            ) : skills.length === 0 ? (
                <Box textAlign="center" py={16} border="1px dashed var(--line)" borderRadius="10px">
                    <Text fontFamily="var(--font-display)" fontSize="lg" mb={1}>Nothing listed yet</Text>
                    <Text color="var(--ink-soft)" fontSize="sm">Create your first listing to start getting booked.</Text>
                </Box>
            ) : (
                <VStack gap={3} align="stretch">
                    {skills.map((skill) => {
                        const style = STATUS_COLOR[skill.status];
                        return (
                            <Box key={skill._id} border="1px solid var(--line)" borderRadius="8px" p={4} bg="var(--paper-raised)">
                                <HStack justify="space-between" flexWrap="wrap" gap={2}>
                                    <Box>
                                        <HStack gap={2} mb={1}>
                                            <Text fontWeight="600">{skill.title}</Text>
                                            <Badge bg={style.bg} color={style.color} textTransform="capitalize">{skill.status}</Badge>
                                        </HStack>
                                        <Text fontSize="sm" color="var(--ink-soft)">{skill.category}</Text>
                                    </Box>
                                    <HStack gap={2}>
                                        <RouterLink to={`/skills/${skill._id}/edit`}>
                                            <Button size="sm" variant="outline" borderColor="var(--line)">Edit</Button>
                                        </RouterLink>
                                        <Button size="sm" variant="outline" borderColor="var(--rust)" color="var(--rust)" onClick={() => handleDelete(skill._id)}>
                                            Delete
                                        </Button>
                                    </HStack>
                                </HStack>
                            </Box>
                        );
                    })}
                </VStack>
            )}
        </Box>
    );
};

export default MySkills;