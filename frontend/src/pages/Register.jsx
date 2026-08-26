import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Button, Checkbox, Field, HStack, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { registerApi } from "@/api/auth";
import { toaster } from "@/components/ui/toaster";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ fullName: "", email: "", password: "", phoneNumber: "" });
    const [role, setRole] = useState(["seeker"]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Full name is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
        if (form.password.length < 6) e.password = "Password must be at least 6 characters";
        if (!/^\d{10}$/.test(form.phoneNumber)) e.phoneNumber = "Enter a valid 10-digit phone number";
        if (role.length === 0) e.role = "Pick at least one role";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await registerApi({ ...form, phoneNumber: Number(form.phoneNumber), role });
            toaster.create({ title: "Registration complete", description: "You can log in now.", type: "success" });
            navigate("/login");
        } catch (err) {
            toaster.create({
                title: "Registration failed",
                description: err.response?.data?.message || "Something went wrong",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="app-main" maxW="440px" py={12}>
            <Heading fontFamily="var(--font-display)" size="lg" mb={1}>Create your account</Heading>
            <Text color="var(--ink-soft)" mb={8} fontSize="sm">Join as a helper, a seeker, choose your role</Text>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root invalid={!!errors.fullName}>
                        <Field.Label>Full name</Field.Label>
                        <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        {errors.fullName && <Field.ErrorText>{errors.fullName}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.email}>
                        <Field.Label>Email</Field.Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.password}>
                        <Field.Label>Password</Field.Label>
                        <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.phoneNumber}>
                        <Field.Label>Phone number</Field.Label>
                        <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                        {errors.phoneNumber && <Field.ErrorText>{errors.phoneNumber}</Field.ErrorText>}
                    </Field.Root>

<Field.Root invalid={!!errors.role}>
    <Field.Label>I want to</Field.Label>

    <HStack gap={5}>
        <label className="register-role-option">
            <input
                type="radio"
                name="register-role"
                value="seeker"
                checked={role[0] === "seeker"}
                onChange={() => setRole(["seeker"])}
            />
            <span className="register-radio"></span>
            <span>Find help (seeker)</span>
        </label>

        <label className="register-role-option">
            <input
                type="radio"
                name="register-role"
                value="helper"
                checked={role[0] === "helper"}
                onChange={() => setRole(["helper"])}
            />
            <span className="register-radio"></span>
            <span>Offer help (helper)</span>
        </label>
    </HStack>

    {errors.role && (
        <Field.ErrorText>{errors.role}</Field.ErrorText>
    )}
</Field.Root>
                        

                                     <Button type="submit" loading={loading} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }} mt={2}>
                        Create account
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
                Already have an account? <RouterLink to="/login" style={{ color: "var(--teal)" }}>Log in</RouterLink>
            </Text>
        </Box>
    );
};

export default Register;