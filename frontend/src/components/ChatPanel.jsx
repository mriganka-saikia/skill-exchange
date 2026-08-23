import { useEffect, useRef, useState } from "react";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { getMessagesApi, sendMessageApi } from "@/api/bookings";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";

const ChatPanel = ({ bookingId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        getMessagesApi(bookingId).then((res) => setMessages(res.data.messages));
    }, [bookingId]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const onMessage = (msg) => {
            if (String(msg.booking) !== String(bookingId)) return;
            setMessages((prev) => [...prev, msg]);
        };

        socket.on("chat:message", onMessage);
        return () => socket.off("chat:message", onMessage);
    }, [bookingId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSending(true);
        try {
            await sendMessageApi(bookingId, text.trim());
            setText("");
        } finally {
            setSending(false);
        }
    };

    return (
        <Box border="1px solid var(--line)" borderRadius="10px" bg="var(--paper-raised)" p={4}>
            <VStack align="stretch" gap={2} maxH="320px" overflowY="auto" mb={3}>
                {messages.length === 0 && (
                    <Text fontSize="sm" color="var(--ink-soft)">No messages yet — say hello.</Text>
                )}
                {messages.map((m) => {
                    const isMine = String(m.sender) === String(user?._id);
                    return (
                        <Box
                            key={m._id}
                            alignSelf={isMine ? "flex-end" : "flex-start"}
                            bg={isMine ? "var(--gold)" : "var(--paper)"}
                            color={isMine ? "white" : "var(--ink)"}
                            border={isMine ? "none" : "1px solid var(--line)"}
                            borderRadius="8px"
                            px={3}
                            py={2}
                            maxW="75%"
                        >
                            <Text fontSize="sm">{m.content}</Text>
                        </Box>
                    );
                })}
                <div ref={bottomRef} />
            </VStack>

            <form onSubmit={handleSend}>
                <HStack gap={2}>
                    <Input
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Button type="submit" loading={sending} bg="var(--gold)" color="white">
                        Send
                    </Button>
                </HStack>
            </form>
        </Box>
    );
};

export default ChatPanel;