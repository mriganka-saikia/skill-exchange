import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Field, HStack, Heading, Skeleton, Text, Textarea, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { getBookingByIdApi, updateBookingStatusApi, createReviewApi } from "@/api/bookings";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";
import BookingStatusBadge from "@/components/BookingStatusBadge";
import StarRating from "@/components/StarRating";

const STEPS = ["requested", "accepted", "completed"];

const StatusTimeline = ({ status }) => {
    const isTerminalCancel = status === "declined" || status === "cancelled";
    const activeIndex = STEPS.indexOf(status);

    return (
        <HStack gap={0} mb={8}>
            {STEPS.map((step, i) => (
                <HStack key={step} flex={1} gap={0}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: !isTerminalCancel && i <= activeIndex ? "var(--gold)" : "var(--line)",
                        }}
                    />
                    {i < STEPS.length - 1 && (
                        <Box flex={1} height="2px" bg={!isTerminalCancel && i < activeIndex ? "var(--gold)" : "var(--line)"} />
                    )}
                </HStack>
            ))}
        </HStack>
    );
};

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [review, setReview] = useState({ rating: 5, comment: "" });

    const load = async () => {
        setLoading(true);
        try {
            const res = await getBookingByIdApi(id);
            setBooking(res.data.booking);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [id]);

    const changeStatus = async (status) => {
        setBusy(true);
        try {
            await updateBookingStatusApi(id, status);
            toaster.create({ title: `Booking ${status}`, type: "success" });
            load();
        } catch (err) {
            toaster.create({ title: "Could not update booking", description: err.response?.data?.message, type: "error" });
        } finally {
            setBusy(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await createReviewApi(id, review);
            toaster.create({ title: "Review submitted", type: "success" });
            navigate(`/skills/${booking.skill._id}`);
        } catch (err) {
            toaster.create({ title: "Could not submit review", description: err.response?.data?.message, type: "error" });
        } finally {
            setBusy(false);
        }
    };

    if (loading) return <Box className="app-main" py={10}><Skeleton height="200px" /></Box>;
    if (!booking) return null;

    const isHelper = user?._id === booking.helper._id;
    const isSeeker = user?._id === booking.seeker._id;

    return (
        <Box className="app-main" maxW="560px" py={10}>
            <HStack justify="space-between" mb={2}>
                <Heading fontFamily="var(--font-display)" size="lg">{booking.skill?.title}</Heading>
                <BookingStatusBadge status={booking.status} />
            </HStack>
            <Text color="var(--ink-soft)" fontSize="sm" mb={8}>
                {isHelper ? `Requested by ${booking.seeker.fullName}` : `With ${booking.helper.fullName}`}
            </Text>

            <StatusTimeline status={booking.status} />

            <VStack align="stretch" gap={3} mb={8} border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)">
                {booking.scheduledDate && (
                    <Text fontSize="sm"><b>Preferred date:</b> {new Date(booking.scheduledDate).toLocaleDateString()}</Text>
                )}
                {booking.message && <Text fontSize="sm"><b>Message:</b> {booking.message}</Text>}
            </VStack>

            {isHelper && booking.status === "requested" && (
                <HStack gap={3} mb={8}>
                    <Button loading={busy} bg="var(--teal)" color="white" onClick={() => changeStatus("accepted")}>Accept</Button>
                    <Button loading={busy} variant="outline" borderColor="var(--rust)" color="var(--rust)" onClick={() => changeStatus("declined")}>Decline</Button>
                </HStack>
            )}

            {isSeeker && booking.status === "requested" && (
                <Button loading={busy} variant="outline" borderColor="var(--rust)" color="var(--rust)" mb={8} onClick={() => changeStatus("cancelled")}>
                    Cancel request
                </Button>
            )}

            {booking.status === "accepted" && (
                <HStack gap={3} mb={8}>
                    <Button loading={busy} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }} onClick={() => changeStatus("completed")}>
                        Mark as completed
                    </Button>
                    {isSeeker && (
                        <Button loading={busy} variant="outline" borderColor="var(--rust)" color="var(--rust)" onClick={() => changeStatus("cancelled")}>
                            Cancel
                        </Button>
                    )}
                </HStack>
            )}

            {isSeeker && booking.status === "completed" && (
                <Box border="1px solid var(--line)" borderRadius="10px" p={5} bg="var(--paper-raised)">
                    <Heading size="md" fontFamily="var(--font-display)" mb={4}>Leave a review</Heading>
                    <form onSubmit={submitReview}>
                        <VStack align="stretch" gap={4}>
                            <Field.Root>
                                <Field.Label>Rating</Field.Label>
                                <StarRating value={review.rating} onChange={(n) => setReview({ ...review, rating: n })} />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Comment</Field.Label>
                                <Textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
                            </Field.Root>
                            <Button type="submit" loading={busy} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
                                Submit review
                            </Button>
                        </VStack>
                    </form>
                </Box>
            )}
        </Box>
    );
};

export default BookingDetails;
