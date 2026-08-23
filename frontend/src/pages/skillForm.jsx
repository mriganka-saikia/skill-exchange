import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Field, Heading, Input, NativeSelect, Text, Textarea, VStack } from "@chakra-ui/react";
import { CATEGORIES } from "@/components/FilterDrawer";
import { createSkillApi, updateSkillApi, getSkillByIdApi } from "@/api/skills";
import { toaster } from "@/components/ui/toaster";
import { generateDescriptionApi } from "@/api/ai";


const EMPTY = {
    title: "",
    description: "",
    category: "",
    tags: "",
    rateUnit: "free",
    rateAmount: 0,
    availability: "",
};

const SkillForm = () => {
    const { id } = useParams(); // present when editing
    const isEdit = !!id;
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isEdit) return;
        const load = async () => {
            try {
                const res = await getSkillByIdApi(id);
                const s = res.data.skill;
                setForm({
                    title: s.title,
                    description: s.description,
                    category: s.category,
                    tags: (s.tags || []).join(", "),
                    rateUnit: s.rateUnit,
                    rateAmount: s.rateAmount,
                    availability: s.availability,
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit]);

    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = "Title is required";
        if (!form.description.trim()) e.description = "Description is required";
        if (!form.category) e.category = "Pick a category";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    
    const handleAiGenerate = async () => {
    if (!form.title.trim()) {
        toaster.create({ title: "Add a title first", description: "AI needs a title to write a description.", type: "warning" });
        return;
    }
    setGenerating(true);
    try {
        const res = await generateDescriptionApi({ title: form.title, category: form.category });
        setForm((f) => ({ ...f, description: res.data.output }));
    } catch (err) {
        toaster.create({ title: "AI generation failed", description: err.response?.data?.message, type: "error" });
    } finally {
        setGenerating(false);
    }
};

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (!validate()) return;

        const payload = {
            ...form,
            rateAmount: Number(form.rateAmount) || 0,
            tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        };

        setSaving(true);
        try {
            if (isEdit) {
                await updateSkillApi(id, payload);
                toaster.create({ title: "Listing updated", description: "Sent back for admin re-approval.", type: "success" });
            } else {
                await createSkillApi(payload);
                toaster.create({ title: "Listing submitted", description: "An admin will review it shortly.", type: "success" });
            }
            navigate("/skills/mine");
        } catch (err) {
            toaster.create({ title: "Could not save listing", description: err.response?.data?.message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <Box className="app-main" maxW="560px" py={10}>
            <Heading fontFamily="var(--font-display)" size="lg" mb={1}>
                {isEdit ? "Edit skill listing" : "List a new skill"}
            </Heading>
            <Text color="var(--ink-soft)" mb={8} fontSize="sm">
                {isEdit ? "Changes go back through admin review before they're public again." : "New listings are reviewed by an admin before they go live."}
            </Text>

            <form onSubmit={handleSubmit}>
                <VStack gap={4} align="stretch">
                    <Field.Root invalid={!!errors.title}>
                        <Field.Label>Title</Field.Label>
                        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Beginner guitar lessons" />
                        {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.description}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
        <                   Field.Label>Description</Field.Label>
                                <Button size="xs" variant="outline" loading={generating} onClick={handleAiGenerate}>
                                    ✨ Generate with AI
                                </Button>
                        </Box>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                                {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root invalid={!!errors.category}>
                        <Field.Label>Category</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                <option value="">Select a category</option>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {errors.category && <Field.ErrorText>{errors.category}</Field.ErrorText>}
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Tags (comma separated)</Field.Label>
                        <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="beginner, acoustic, weekends" />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Rate type</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field value={form.rateUnit} onChange={(e) => setForm({ ...form, rateUnit: e.target.value })}>
                                <option value="free">Free</option>
                                <option value="swap">Skill swap</option>
                                <option value="per-session">Per session</option>
                                <option value="per-hour">Per hour</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>

                    {(form.rateUnit === "per-session" || form.rateUnit === "per-hour") && (
                        <Field.Root>
                            <Field.Label>Amount (₹)</Field.Label>
                            <Input type="number" min={0} value={form.rateAmount} onChange={(e) => setForm({ ...form, rateAmount: e.target.value })} />
                        </Field.Root>
                    )}

                    <Field.Root>
                        <Field.Label>Availability</Field.Label>
                        <Input value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} placeholder="e.g. Weekday evenings" />
                    </Field.Root>

                    <Button type="submit" loading={saving} bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }} mt={2}>
                        {isEdit ? "Save changes" : "Submit for approval"}
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default SkillForm;
