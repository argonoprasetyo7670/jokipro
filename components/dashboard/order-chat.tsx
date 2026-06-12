"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { IconSend, IconPaperclip, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { sendMessageAction } from "@/lib/actions/orders";
import { toast } from "sonner";

interface Message {
  id: string;
  senderId: string;
  content: string;
  attachment: string | null;
  createdAt: string;
  sender: {
    name: string | null;
    image: string | null;
  };
}

interface OrderChatProps {
  orderId: string;
  messages: Message[];
  currentUserId: string;
}

export function OrderChat({ orderId, messages, currentUserId }: OrderChatProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("orderId", orderId);
    if (file) {
      formData.append("attachment", file);
    }

    const content = formData.get("content") as string;
    if (!content?.trim() && !file) return;

    startTransition(async () => {
      try {
        await sendMessageAction(formData);
        formRef.current?.reset();
        setFile(null);
      } catch (error: any) {
        toast.error(error.message || "Gagal mengirim pesan");
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Belum ada pesan. Mulai percakapan!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <UserAvatar name={msg.sender.name || "User"} image={msg.sender.image} size="sm" className="shrink-0 mt-1" />
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-muted rounded-tl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.attachment && (
                    <a
                      href={msg.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded-lg bg-accent/50 text-xs text-primary hover:bg-accent transition-colors"
                    >
                      <IconPaperclip size={12} />
                      Lampiran
                    </a>
                  )}
                  <p className={`text-[10px] text-muted-foreground mt-1 ${isMe ? "text-right" : ""}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File indicator */}
      {file && (
        <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg text-xs">
          <IconPaperclip size={14} className="text-primary" />
          <span className="truncate flex-1">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
            <IconX size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <form ref={formRef} onSubmit={handleSubmit} className="p-4 border-t flex gap-2 items-end">
        <label className="cursor-pointer shrink-0">
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <IconPaperclip size={18} />
          </div>
        </label>
        <Input
          name="content"
          placeholder="Tulis pesan..."
          disabled={isPending}
          autoComplete="off"
          className="rounded-xl h-10 bg-background"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isPending}
          className="shrink-0 h-10 w-10 rounded-xl bg-primary"
        >
          <IconSend size={18} />
        </Button>
      </form>
    </div>
  );
}
