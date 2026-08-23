import { HStack, Icon } from "@chakra-ui/react";
import { LuStar } from "react-icons/lu";

// value: current rating. onChange: pass to make it an interactive input; omit for read-only display.
const StarRating = ({ value = 0, onChange, size = 18 }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
        <HStack gap={1}>
            {stars.map((n) => (
                <Icon
                    key={n}
                    as={LuStar}
                    boxSize={`${size}px`}
                    color={n <= value ? "var(--gold)" : "var(--line)"}
                    fill={n <= value ? "var(--gold)" : "none"}
                    cursor={onChange ? "pointer" : "default"}
                    onClick={() => onChange && onChange(n)}
                />
            ))}
        </HStack>
    );
};

export default StarRating;