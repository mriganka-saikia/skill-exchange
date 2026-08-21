import { Button, HStack, Text } from "@chakra-ui/react";

const PaginationComp = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <HStack justify="center" gap={3} mt={8}>
            <Button
                size="sm"
                variant="outline"
                borderColor="var(--line)"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>
            <Text className="mono-tag">
                Page {page} of {totalPages}
            </Text>
            <Button
                size="sm"
                variant="outline"
                borderColor="var(--line)"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </HStack>
    );
};

export default PaginationComp;
