import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Badge, Button, Field, HStack, Heading, Input, Skeleton, Text, Textarea, VStack } from "@chakra-ui/react";
import { getSkillByIdApi, getSkillReviewsApi, bookSkillApi } from "@/api/skills";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";
import StarRating from "@/components/StarRating";

const SkillDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [skill, setSkill] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState({ message: "", scheduledDate: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [skillRes, reviewsRes] = await Promise.all([getSkillByIdApi(id), getSkillReviewsApi(id)]);
                setSkill(skillRes.data.skill);
                setReviews(reviewsRes.data.reviews);
            } catch {
                toaster.create({ title: "Could not load this listing", type: "error" });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleBook = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        setSubmitting(true);
        try {
            await bookSkillApi(id, booking);
            toaster.create({ title: "Booking request sent", description: "The helper will accept or decline soon.", type: "success" });
            navigate("/bookings/mine");
        } catch (err) {
            toaster.create({ title: "Could not book this session", description: err.response?.data?.message, type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box className="app-main" py={10}>
                <Skeleton height="40px" mb={4} width="60%" />
                <Skeleton height="200px" />
            </Box>
        );
    }

    if (!skill) return null;

    const isOwnListing = user && skill.helper?._id === user._id;

    return (
        <Box className="app-main" py={10}>
            <HStack gap={6} align="start" flexDirection={{ base: "column", md: "row" }}>
                <Box flex={2}>
                    <Text className="mono-tag" mb={2}>{skill.category}</Text>
                    <Heading fontFamily="var(--font-display)" size="xl" mb={3}>{skill.title}</Heading>
                    <Text color="var(--ink-soft)" mb={5}>{skill.description}</Text>

                    <HStack gap={2} mb={6} wrap="wrap">
                        {(skill.tags || []).map((tag) => (
                            <Badge key={tag} variant="subtle" bg="rgba(47,111,98,0.12)" color="var(--teal)">{tag}</Badge>
                        ))}
                    </HStack>

                    <Box border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)" mb={8}>
                        <Text className="mono-tag" mb={1}>Offered by</Text>
                        <Heading size="md" fontFamily="var(--font-display)" mb={1}>{skill.helper?.fullName}</Heading>
                        <HStack gap={3}>
                            <StarRating value={Math.round(skill.helper?.avgRating || 0)} />
                            <Text fontSize="sm" color="var(--ink-soft)">
                                {skill.helper?.avgRating?.toFixed(1) || "No ratings yet"} · {skill.helper?.sessionsCompleted || 0} sessions completed
                            </Text>
                        </HStack>
                        {skill.helper?.bio && <Text fontSize="sm" color="var(--ink-soft)" mt={2}>{skill.helper.bio}</Text>}
                    </Box>

                    <Heading size="md" fontFamily="var(--font-display)" mb={4}>Reviews ({reviews.length})</Heading>
                    <VStack align="stretch" gap={3}>
                        {reviews.length === 0 && <Text fontSize="sm" color="var(--ink-soft)">No reviews yet — be the first.</Text>}
                        {reviews.map((r) => (
                            <Box key={r._id} border="1px solid var(--line)" borderRadius="8px" p={4}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontWeight="600" fontSize="sm">{r.reviewer?.fullName}</Text>
                                    <StarRating value={r.rating} size={14} />
                                </HStack>
                                {r.comment && <Text fontSize="sm" color="var(--ink-soft)">{r.comment}</Text>}
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Box flex={1} minW="280px" position={{ md: "sticky" }} top="90px">
                    <Box className="ticket" flexDirection="column">
                        <VStack className="ticket-body" align="stretch" gap={3}>
                            <Text fontFamily="var(--font-display)" fontWeight="700" fontSize="lg" color="var(--gold-deep)">
                                {skill.rateUnit === "free" ? "Free" : skill.rateUnit === "swap" ? "Skill Swap" : `₹${skill.rateAmount} ${skill.rateUnit}`}
                            </Text>
                            <Text fontSize="sm" color="var(--ink-soft)">{skill.availability}</Text>

                            {isOwnListing ? (
                                <Text fontSize="sm" color="var(--ink-soft)">This is your own listing.</Text>
                            ) : (
                                <form onSubmit={handleBook}>
                                    <VStack align="stretch" gap={3}>
                                        <Field.Root>
                                            <Field.Label>Preferred date</Field.Label>
                                            <Input
                                                type="date"
                                                value={booking.scheduledDate}
                                                onChange={(e) => setBooking({ ...booking, scheduledDate: e.target.value })}
                                            />
                                        </Field.Root>
                                        <Field.Root>
                                            <Field.Label>Message to helper</Field.Label>
                                            <Textarea
                                                placeholder="What would you like help with?"
                                                value={booking.message}
                                                onChange={(e) => setBooking({ ...booking, message: e.target.value })}
                                            />
                                        </Field.Root>
                                        <Button type="submit" loading={submitting} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
                                            Request booking
                                        </Button>
                                    </VStack>
                                </form>
                            )}
                        </VStack>
                    </Box>
                </Box>
            </HStack>
        </Box>
    );
};

export default SkillDetails;
