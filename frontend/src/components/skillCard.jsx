import { Link as RouterLink } from "react-router-dom";
import { Badge, Box, HStack, Heading, Text, VStack } from "@chakra-ui/react";

const RATE_LABEL = {
    free: "Free",
    swap: "Skill Swap",
    "per-session": "/ session",
    "per-hour": "/ hour",
};

const SkillCard = ({ skill }) => {
    const rateText =
        skill.rateUnit === "free" || skill.rateUnit === "swap"
            ? RATE_LABEL[skill.rateUnit]
            : `₹${skill.rateAmount || 0} ${RATE_LABEL[skill.rateUnit]}`;

    return (
        <RouterLink to={`/skills/${skill._id}`} style={{ textDecoration: "none" }}>
            <Box className="ticket">
                <Box className="ticket-body">
                    <HStack justify="space-between" align="start" mb={1}>
                        <Text className="mono-tag">{skill.category}</Text>
                        {skill.helper?.avgRating > 0 && (
                            <Text className="mono-tag">★ {skill.helper.avgRating.toFixed(1)}</Text>
                        )}
                    </HStack>
                    <Heading
                        as="h3"
                        size="md"
                        fontFamily="var(--font-display)"
                        color="var(--ink)"
                        mb={1}
                        lineClamp={1}
                    >
                        {skill.title}
                    </Heading>
                    <Text fontSize="sm" color="var(--ink-soft)" lineClamp={2} mb={2}>
                        {skill.description}
                    </Text>
                    <HStack gap={2} wrap="wrap">
                        {(skill.tags || []).slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="subtle" bg="rgba(47,111,98,0.12)" color="var(--teal)">
                                {tag}
                            </Badge>
                        ))}
                    </HStack>
                </Box>
                <VStack className="ticket-stub" justify="center">
                    <Text fontFamily="var(--font-display)" fontWeight="700" fontSize="sm" textAlign="center" color="var(--gold-deep)">
                        {rateText}
                    </Text>
                    <Text className="mono-tag" textAlign="center">
                        {skill.helper?.fullName?.split(" ")[0] || "Helper"}
                    </Text>
                </VStack>
            </Box>
        </RouterLink>
    );
};

export default SkillCard;
