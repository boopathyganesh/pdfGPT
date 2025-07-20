'use client';

import { useChatStore } from '@/store/ChatStore';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
import ReactMarkdown from "react-markdown";
interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Chat({ initialMessages = [] }: { initialMessages?: Message[] }) {
    // const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messages = useChatStore((state) => state.messages);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);



    const addMessage = useChatStore((state) => state.addMessage);
    const setSocket = useChatStore((state) => state.setSocket);
    const socket = useChatStore((state) => state.socket);


    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/chat");
        setSocket(ws);
        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            setLoading(false);
            const message = event.data;
            console.log("📩 Message received:", message);
            // addMessage({ role: 'assistant', content: message });
            showTypingEffect(message);
        };

        ws.onerror = (err) => {
            console.error("❌ WebSocket error", err);
        };

        ws.onclose = () => {
            console.log("🔌 WebSocket disconnected");
            setSocket(null);
        };

        return () => {
            console.log("🧹 Cleaning up WebSocket");
            ws.close();
        };
    }, [addMessage, setSocket]);


    // const showTypingEffect = (fullText: string) => {
    //     setIsTyping(true);
    //     let index = 0;
    //     const speed = 10; // milliseconds per character
    //     const assistantMessage = { role: "assistant" as const, content: "" };

    //     setMessages((prev) => [...prev, assistantMessage]);

    //     const interval = setInterval(() => {
    //         index++;
    //         setMessages((prev) => {
    //             const updated = [...prev];
    //             const last = { ...updated[updated.length - 1] };
    //             last.content = fullText.slice(0, index);
    //             updated[updated.length - 1] = last;
    //             return updated;
    //         });

    //         if (index >= fullText.length) {
    //             clearInterval(interval);
    //             setIsTyping(false);
    //         }
    //     }, speed);
    // };

    // const askQuestion = async () => {
    //     if (!input.trim()) return;
    //     const newMessages = [...messages, { role: 'user', content: input } as const];
    //     setMessages([
    //         ...messages,
    //         { role: 'user' as const, content: input }
    //     ]);
    //     setInput('');
    //     setLoading(true);

    //     const res = await fetch('http://localhost:8000/ask', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ question: input }),
    //     });

    //     const data = await res.json();
    //     setLoading(false);

    //     // if (data.answer) {
    //     //     setMessages([
    //     //         ...newMessages,
    //     //         { role: 'assistant' as const, content: data.answer }
    //     //     ]);
    //     // } else {
    //     //     setMessages([
    //     //         ...newMessages,
    //     //         { role: 'assistant' as const, content: 'Something went wrong.' }
    //     //     ]);
    //     // }
    //     if (data.answer) {
    //         showTypingEffect(data.answer);
    //     } else {
    //         showTypingEffect("Something went wrong.");
    //     }

    // };

    const showTypingEffect = (fullText: string) => {
        setIsTyping(true);
        let index = 0;
        const speed = 10;

        let currentMessage = { role: 'assistant' as const, content: '' };
        addMessage(currentMessage);

        const interval = setInterval(() => {
            index++;

            useChatStore.setState((state) => {
                const updatedMessages = [...state.messages];
                const lastMsg = updatedMessages[updatedMessages.length - 1];
                if (lastMsg.role === 'assistant') {
                    lastMsg.content = fullText.slice(0, index);
                    updatedMessages[updatedMessages.length - 1] = lastMsg;
                    return { messages: updatedMessages };
                }
                return state;
            });

            if (index >= fullText.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);
    };

    const askQuestion = () => {
        const trimmed = input.trim();
        if (!trimmed || !socket || socket.readyState !== WebSocket.OPEN) return;
        setLoading(true)
        addMessage({ role: 'user', content: trimmed });
        socket.send(JSON.stringify({ question: trimmed }));

        setInput('');
    };


    const handleUpload = async (files: File[]) => {
        if (!files.length) return;

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        setLoading(true);
        // const res = await fetch("https://pdfgpt-server-fi7b.onrender.com/upload", {
        //     method: "POST",
        //     body: formData,
        // });
        const res = await axios.post("http://localhost:8000/upload", formData)
        if (res.data) {
            setLoading(false);

            if (res.data.notice) {
                addMessage({ role: "assistant", content: res.data.notice });

            }
        }

        // if (data.notice) {
        //     addMessage({ role: "assistant", content: data.notice });
        // }
    };

    return (
        <div className="flex flex-col gap-2 w-full bg-gray-400/50 rounded-2xl">
            <div className="rounded p-4 h-[600px] overflow-y-auto mb-2">
                {messages.map((msg, i) => (
                    <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                        <div className={`p-2 my-1 inline-block rounded-lg ${msg.role === 'user' ? 'bg-gray-500/70' : 'bg-transparent'}`}>
                            <ReactMarkdown>
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <div className="text-base font-medium text-gray-200">Thinking...</div>}
                <div ref={bottomRef} />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    askQuestion();
                }}
                className="flex items-center gap-2 bg-gray-400/70 py-3 px-4 rounded-2xl"
            >
                <label className=" bg-black h-8 w-8 flex items-center justify-center p-2 text-center rounded-full cursor-pointer text-white text-xl font-bold">
                    <FaPlus className='' />
                    <input
                        type="file"
                        multiple
                        accept="application/pdf"
                        onChange={(e) => {
                            const selectedFiles = Array.from(e.target.files || []);
                            if (selectedFiles.length > 0) {
                                handleUpload(selectedFiles); // pass selected files
                            }
                        }}
                        className="hidden"
                    />
                </label>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="Your question here..."
                />
                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                    Send
                </button>
            </form>

        </div>
    );
}
