import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Grid, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const STEPS = [
    { title: "List a skill", body: "Tutoring, repairs, cooking, code, music — offer what you're good at." },
    { title: "Get booked", body: "Seekers browse and request a session. You accept and set up a time." },
    { title: "Build trust", body: "Complete the session, collect a review, watch your trust score grow." },
];

const Landing = () => {
    return (
        <Box>
            <Box className="app-main" pt={{ base: 12, md: 20 }} pb={{ base: 10, md: 16 }}>
                <Grid templateColumns={{ base: "1fr", md: "1.1fr 0.9fr" }} gap={10} alignItems="center">
                    <MotionBox
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Text className="mono-tag" mb={3}>Local · Peer-to-peer · No money required</Text>
                        <Heading
                            as="h1"
                            fontFamily="var(--font-display)"
                            fontSize={{ base: "4xl", md: "5xl", xl: "6xl" }}
                            lineHeight="1.1"
                            color="var(--ink)"
                            mb={4}
                        >
                            Trade skills, not cash.
                        </Heading>
                        <Text fontSize="lg" color="var(--ink-soft)" mb={8} maxW="480px">
                            Swap connects people who can teach or help with people who need it — tutoring,
                            repairs, cooking, code, music — one campus or neighbourhood at a time.
                        </Text>
                        <HStack gap={4}>
                            <RouterLink to="/register">
                                <Button size="lg" bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
                                    Get started
                                </Button>
                            </RouterLink>
                            <RouterLink to="/browse">
                                <Button size="lg" variant="outline" borderColor="var(--line)">
                                    Browse skills
                                </Button>
                            </RouterLink>
                        </HStack>
                    </MotionBox>

                    <MotionBox
                        initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: -2 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="ticket"
                        maxW="360px"
                        justifySelf={{ md: "end" }}
                    >
                        <Box className="ticket-body">
                            <Text className="mono-tag" mb={1}>Coding & Tech</Text>
                            <Heading as="h3" size="md" fontFamily="var(--font-display)" mb={2}>
                                React Fundamentals, 1:1
                            </Heading>
                            <Text fontSize="sm" color="var(--ink-soft)">
                                Helping you build your first component-driven app, from hooks to routing.
                            </Text>
                        </Box>
                        <VStack className="ticket-stub" justify="center">
                            <Text fontFamily="var(--font-display)" fontWeight="700" color="var(--gold-deep)">
                                Swap
                            </Text>
                            <Text className="mono-tag">Priya K.</Text>
                        </VStack>
                    </MotionBox>
                </Grid>
            </Box>

            <Box className="app-main" pb={20}>
                <Heading as="h2" fontFamily="var(--font-display)" size="lg" mb={8} textAlign="center">
                    How it works
                </Heading>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
                    {STEPS.map((step, i) => (
                        <MotionBox
                            key={step.title}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            border="1px solid var(--line)"
                            borderRadius="10px"
                            p={6}
                            bg="var(--paper-raised)"
                        >
                            <Text className="mono-tag" mb={2}>Step {i + 1}</Text>
                            <Heading as="h3" size="md" fontFamily="var(--font-display)" mb={2}>
                                {step.title}
                            </Heading>
                            <Text fontSize="sm" color="var(--ink-soft)">
                                {step.body}
                            </Text>
                        </MotionBox>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default Landing;