import { Button, CloseButton, Drawer, Field, Input, NativeSelect, Portal, VStack } from "@chakra-ui/react";

const CATEGORIES = [
    "Tutoring",
    "Repairs",
    "Cooking",
    "Coding & Tech",
    "Music",
    "Art & Design",
    "Fitness",
    "Languages",
    "Other",
];

const FilterDrawer = ({ open, onOpenChange, filters, onApply }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        onApply({
            category: form.get("category") || "",
            search: form.get("search") || "",
        });
        onOpenChange(false);
    };

    return (
        <Drawer.Root open={open} onOpenChange={(d) => onOpenChange(d.open)} placement="end">
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content bg="var(--paper-raised)">
                        <Drawer.Header>
                            <Drawer.Title fontFamily="var(--font-display)">Filter listings</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body>
                            <form id="filter-form" onSubmit={handleSubmit}>
                                <VStack gap={4} align="stretch">
                                    <Field.Root>
                                        <Field.Label>Search</Field.Label>
                                        <Input name="search" defaultValue={filters.search} placeholder="e.g. guitar, calculus, plumbing" />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>Category</Field.Label>
                                        <NativeSelect.Root>
                                            <NativeSelect.Field name="category" defaultValue={filters.category}>
                                                <option value="">All categories</option>
                                                {CATEGORIES.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Field.Root>
                                </VStack>
                            </form>
                        </Drawer.Body>
                        <Drawer.Footer>
                            <Button type="submit" form="filter-form" bg="var(--gold)" color="white" _hover={{ bg: "var(--gold-deep)" }}>
                                Apply filters
                            </Button>
                        </Drawer.Footer>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};

export { CATEGORIES };
export default FilterDrawer;
