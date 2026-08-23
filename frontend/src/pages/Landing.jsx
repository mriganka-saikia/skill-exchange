import { Box, Heading, Text } from "@chakra-ui/react";

const Landing = () => (
    <Box className="app-main" pt={16}>
        <Heading fontFamily="var(--font-display)" size="2xl">Trade skills, not cash.</Heading>
        <Text mt={4} color="var(--ink-soft)">Swap connects helpers and seekers nearby.</Text>
    </Box>
);

export default Landing;