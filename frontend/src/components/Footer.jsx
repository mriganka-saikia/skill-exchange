import { Box, HStack, Text } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box borderTop="1px solid var(--line)" mt={16} py={6}>
            <HStack className="app-main" justify="space-between" flexWrap="wrap" gap={2}>
                <Text fontFamily="var(--font-display)" fontSize="sm" color="var(--ink-soft)">
                    Swap — a local skill-exchange platform
                </Text>
                <Text className="mono-tag">Built for PBEL Full Stack · Spec #51</Text>
            </HStack>
        </Box>
    );
};

export default Footer;