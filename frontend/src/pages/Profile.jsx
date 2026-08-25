import { useState } from "react";
import { Box, Button, Field, HStack, Heading, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import { updateProfileApi } from "@/api/auth";
import { toaster } from "@/components/ui/toaster";
import StarRating from "@/components/StarRating";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.bio || "",
        location: user?.location || "",
    });
    const [role, setRole] = useState(user?.role || ["seeker"]);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateProfileApi({ ...form, role });
            updateUser(res.data.user);
            toaster.create({ title: "Profile updated", type: "success" });
        } catch (err) {
            toaster.create({ title: "Could not update profile", description: err.response?.data?.message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box className="app-main" maxW="520px" py={10}>
            <Heading fontFamily="var(--font-display)" size="xl" mb={2}>Your profile</Heading>

            <HStack gap={4} mb={8} border="1px solid var(--line)" borderRadius="10px" p={4} bg="var(--paper-raised)">
                <StarRating value={Math.round(user?.avgRating || 0)} />
                <Text fontSize="sm" color="var(--ink-soft)">
                    {user?.avgRating > 0 ? `${user.avgRating.toFixed(1)} average` : "No ratings yet"} · {user?.sessionsCompleted || 0} sessions completed
                </Text>
            </HStack>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root>
                        <Field.Label>Full name</Field.Label>
                        <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Phone number</Field.Label>
                        <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Location</Field.Label>
                        <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. North Campus" />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Bio</Field.Label>
                        <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
                    </Field.Root>
               <Field.Root>
    <Field.Label>Roles</Field.Label>

    <HStack gap={5}>
        <label className="profile-role-option">
            <input
                type="checkbox"
                checked={role.includes("seeker")}
                onChange={(e) => {
                    setRole((current) =>
                        e.target.checked
                            ? [...new Set([...current, "seeker"])]
                            : current.filter((r) => r !== "seeker")
                    );
                }}
            />
            <span className="profile-checkbox"></span>
            <span>Seeker</span>
        </label>

        <label className="profile-role-option">
            <input
                type="checkbox"
                checked={role.includes("helper")}
                onChange={(e) => {
                    setRole((current) =>
                        e.target.checked
                            ? [...new Set([...current, "helper"])]
                            : current.filter((r) => r !== "helper")
                    );
                }}
            />
            <span className="profile-checkbox"></span>
            <span>Helper</span>
        </label>
    </HStack>
</Field.Root>
                    <Button type="submit" loading={saving} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }} mt={2}>
                        Save changes
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default Profile;