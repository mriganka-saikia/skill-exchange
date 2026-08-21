import { Badge } from "@chakra-ui/react";

const STATUS_STYLES = {
    requested: { bg: "rgba(200,150,30,0.15)", color: "var(--gold-deep)", label: "Requested" },
    accepted: { bg: "rgba(47,111,98,0.15)", color: "var(--teal)", label: "Accepted" },
    completed: { bg: "rgba(31,42,36,0.1)", color: "var(--ink)", label: "Completed" },
    declined: { bg: "rgba(182,82,47,0.12)", color: "var(--rust)", label: "Declined" },
    cancelled: { bg: "rgba(182,82,47,0.12)", color: "var(--rust)", label: "Cancelled" },
};

const BookingStatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || STATUS_STYLES.requested;
    return (
        <Badge bg={style.bg} color={style.color} px={2} py={1} borderRadius="6px" fontFamily="var(--font-mono)" fontSize="xs" textTransform="uppercase">
            {style.label}
        </Badge>
    );
};

export default BookingStatusBadge;
