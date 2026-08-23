import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Box borderBottom="1px solid var(--line)" bg="var(--paper-raised)" position="sticky" top={0} zIndex={10}>
            <HStack className="app-main" justify="space-between" py={3}>
                <RouterLink to="/" style={{ textDecoration: "none" }}>
                    <Text fontFamily="var(--font-display)" fontWeight="700" fontSize="xl" color="var(--ink)">
                        Swap<Text as="span" color="var(--gold)">.</Text>
                    </Text>
                </RouterLink>

                <HStack gap={5}>
                    <RouterLink to="/browse" style={{ textDecoration: "none" }}>
                        <Text fontSize="sm" color="var(--ink-soft)">Browse</Text>
                    </RouterLink>

                    {user ? (
                        <>
                            <RouterLink to="/dashboard" style={{ textDecoration: "none" }}>
                                <Text fontSize="sm" color="var(--ink-soft)">Dashboard</Text>
                            </RouterLink>
                            {user.isAdmin && (
                                <RouterLink to="/admin" style={{ textDecoration: "none" }}>
                                    <Text fontSize="sm" color="var(--ink-soft)">Admin</Text>
                                </RouterLink>
                            )}
                            <RouterLink to="/profile" style={{ textDecoration: "none" }}>
                                <Text fontSize="sm" color="var(--ink-soft)">{user.fullName?.split(" ")[0]}</Text>
                            </RouterLink>
                            <Button size="sm" variant="outline" borderColor="var(--line)" onClick={handleLogout}>
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <RouterLink to="/login" style={{ textDecoration: "none" }}>
                                <Text fontSize="sm" color="var(--ink-soft)">Log in</Text>
                            </RouterLink>
                            <RouterLink to="/register" style={{ textDecoration: "none" }}>
                                <Button size="sm" bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
                                    Join
                                </Button>
                            </RouterLink>
                        </>
                    )}
                    <ColorModeButton />
                </HStack>
            </HStack>
        </Box>
    );
};

export default Header;