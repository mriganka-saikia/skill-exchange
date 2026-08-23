import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

const FourOFour = () => {
    return (
        <Box className="app-main" py={24} textAlign="center">
            <Text className="mono-tag" mb={2}>404</Text>
            <Heading fontFamily="var(--font-display)" size="2xl" mb={3}>This ticket doesn't exist</Heading>
            <Text color="var(--ink-soft)" mb={8}>The page you're looking for was moved, renamed, or never existed.</Text>
            <RouterLink to="/">
                <Button bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>Back to home</Button>
            </RouterLink>
        </Box>
    );
};

export default FourOFour;