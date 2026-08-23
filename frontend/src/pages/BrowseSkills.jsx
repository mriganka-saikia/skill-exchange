import { useEffect, useState } from "react";
import { Box, Button, Grid, HStack, Heading, Skeleton, Text } from "@chakra-ui/react";
import { LuSlidersHorizontal } from "react-icons/lu";
import SkillCard from "@/components/SkillCard";
import PaginationComp from "@/components/PaginationComp";
import FilterDrawer from "@/components/FilterDrawer";
import { getSkillsApi } from "@/api/Skills";

const BrowseSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ category: "", search: "" });
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getSkillsApi({ ...filters, page, limit: 9 });
                setSkills(res.data.skills);
                setTotalPages(res.data.totalPages);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page, filters]);

    return (
        <Box className="app-main" py={10}>
            <HStack justify="space-between" mb={8} flexWrap="wrap" gap={3}>
                <Box>
                    <Heading fontFamily="var(--font-display)" size="xl">Browse skills</Heading>
                    <Text color="var(--ink-soft)" fontSize="sm">Find someone nearby who can help.</Text>
                </Box>
                <Button variant="outline" borderColor="var(--line)" onClick={() => setDrawerOpen(true)}>
                    <LuSlidersHorizontal style={{ marginRight: 8 }} /> Filters
                </Button>
            </HStack>

            {loading ? (
                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap={5}>
                    {[...Array(6)].map((_, i) => <Skeleton key={i} height="150px" borderRadius="10px" />)}
                </Grid>
            ) : skills.length === 0 ? (
                <Box textAlign="center" py={20} border="1px dashed var(--line)" borderRadius="10px">
                    <Text fontFamily="var(--font-display)" fontSize="lg" mb={1}>No listings match yet</Text>
                    <Text color="var(--ink-soft)" fontSize="sm">Try clearing your filters or check back soon.</Text>
                </Box>
            ) : (
                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap={5}>
                    {skills.map((skill) => <SkillCard key={skill._id} skill={skill} />)}
                </Grid>
            )}

            <PaginationComp page={page} totalPages={totalPages} onPageChange={setPage} />

            <FilterDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                filters={filters}
                onApply={(f) => {
                    setPage(1);
                    setFilters(f);
                }}
            />
        </Box>
    );
};

export default BrowseSkills;
