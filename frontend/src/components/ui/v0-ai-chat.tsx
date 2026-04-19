"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    Loader2,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { CONSTANTS } from '@/constants';

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;

            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface VercelV0ChatProps {
    onAiResult?: (itemIds: string[]) => void;
}

export function VercelV0Chat({ onAiResult }: VercelV0ChatProps) {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [userQuery, setUserQuery] = useState<string | null>(null);

    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;
        setIsLoading(true);
        setAiResponse(null);
        setUserQuery(query);
        
        try {
            const res = await axios.post(`${CONSTANTS.API_URL}/api/ai/recommend`, { query });
            if (res.data.success) {
                setAiResponse(res.data.message);
                if (onAiResult) onAiResult(res.data.itemIds || []);
            } else {
                setAiResponse("I couldn't process that request right now.");
            }
        } catch (error) {
            console.error(error);
            setAiResponse("Oops... my culinary AI circuits are a bit overloaded. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSearch(value);
                setValue("");
                adjustHeight(true);
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8"
        >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-green-500 tracking-tight text-center">
                What can I help you order?
            </h1>
            <p className="text-zinc-500 max-w-xl text-center">
                Describe the coconut dish or meal combo you crave, and our AI will fetch the perfect menu recommendations for you.
            </p>

            <div className="w-full">
                <motion.div 
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative bg-white/5 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl border border-zinc-200 dark:border-neutral-800 shadow-xl overflow-hidden"
                >
                    <div className="overflow-y-auto">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="I'm craving a spicy coconut curry bowl..."
                            className={cn(
                                "w-full px-6 py-5 text-lg",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-zinc-900 dark:text-white",
                                "focus:outline-none",
                                "focus-visible:ring-0 focus-visible:ring-offset-0",
                                "placeholder:text-zinc-400 placeholder:text-lg",
                                "min-h-[80px]"
                            )}
                            style={{
                                overflow: "hidden",
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-neutral-900/80 border-t border-zinc-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="group p-2 hover:bg-zinc-200 dark:hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Paperclip className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden group-hover:inline transition-opacity">
                                    Attach Image
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => {
                                    if (value.trim()) {
                                        handleSearch(value);
                                        setValue("");
                                        adjustHeight(true);
                                    }
                                }}
                                className={cn(
                                    "px-2 py-2 rounded-lg text-sm transition-colors border flex items-center justify-between gap-1",
                                    value.trim()
                                        ? "bg-orange-500 border-orange-600 text-white shadow-md hover:bg-orange-600"
                                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"
                                )}
                            >
                                <ArrowUpIcon
                                    className={cn(
                                        "w-4 h-4",
                                        value.trim()
                                            ? "text-white"
                                            : "text-zinc-400"
                                    )}
                                />
                                <span className="sr-only">Send</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* AI Chat Interaction Responses */}
                <AnimatePresence>
                    {(userQuery || isLoading || aiResponse) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 flex flex-col gap-4 overflow-hidden w-full px-2"
                        >
                            {/* User Query Bubble */}
                            {userQuery && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="self-end max-w-[85%] bg-orange-500 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm"
                                >
                                    <p className="text-[15px]">{userQuery}</p>
                                </motion.div>
                            )}

                            {/* AI Loading State */}
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="self-start max-w-[85%] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-sm"
                                >
                                    <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                                    <p className="text-[15px] text-zinc-600 dark:text-zinc-300 font-medium tracking-wide">
                                        Chef AI is analyzing ingredients...
                                    </p>
                                </motion.div>
                            )}

                            {/* AI Response Text Bubble */}
                            {!isLoading && aiResponse && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="self-start relative max-w-[85%] bg-gradient-to-br from-zinc-50 to-orange-50 dark:from-zinc-900 dark:to-orange-950/30 border border-orange-200 dark:border-orange-900/50 px-6 py-4 rounded-2xl rounded-tl-sm shadow-[0_4px_20px_-4px_rgba(249,115,22,0.1)]"
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-0.5">
                                            <Sparkles className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <p className="text-[16px] text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                                            {aiResponse}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-3 mt-6"
                >
                    <ActionButton icon={<ImageIcon className="w-4 h-4" />} label="Coconut" onClick={() => handleSearch("Coconut")} />
                    <ActionButton icon={<MonitorIcon className="w-4 h-4" />} label="Salad" onClick={() => handleSearch("Salad")} />
                    <ActionButton icon={<CircleUserRound className="w-4 h-4" />} label="Desserts" onClick={() => handleSearch("Desserts")} />
                </motion.div>
            </div>
        </motion.div>
    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 hover:bg-zinc-50 dark:hover:bg-neutral-800 rounded-full border border-zinc-200 dark:border-neutral-800 text-zinc-600 dark:text-neutral-400 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm"
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </motion.button>
    );
}
