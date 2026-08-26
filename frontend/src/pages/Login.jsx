import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Button, Field, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { loginApi } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { toaster } from "@/components/ui/toaster";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!form.email || !form.password) {
            setError("Both fields are required");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await loginApi(form);
            login(res.data.user, res.data.token);
            toaster.create({ title: "Welcome back", type: "success" });
            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Login failed";
            setError(message);
            toaster.create({ title: "Login failed", description: message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="app-main" maxW="400px" py={16}>
            <Heading fontFamily="var(--font-display)" size="lg" mb={1}>Welcome back</Heading>
            <Text color="var(--ink-soft)" mb={8} fontSize="sm">Log in to book a session or check your listings.</Text>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root invalid={!!error}>
                        <Field.Label>Email</Field.Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Field.Root>
                    <Field.Root invalid={!!error}>
                        <Field.Label>Password</Field.Label>
                        <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        {error && <Field.ErrorText>{error}</Field.ErrorText>}
                    </Field.Root>
                    <Button type="submit" loading={loading} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }} mt={2}>
                        Log in
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        borderColor="var(--line)"
                        onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)}
                    >
                        Continue with Google
                    </Button>
                </VStack>
            </form>

            <Text fontSize="sm" color="var(--ink-soft)" mt={6} textAlign="center">
                New here? <RouterLink to="/register" style={{ color: "var(--teal)" }}>Create an account</RouterLink>
            </Text>
        </Box>
    );
};

export default Login;