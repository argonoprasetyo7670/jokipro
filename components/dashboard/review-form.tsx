"use client";

import { useState, useTransition } from "react";
import { IconStarFilled, IconLoader2, IconMessageChatbot } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitReviewAction } from "@/lib/actions/reviews";

interface ReviewFormProps {
  orderId: string;
  targetName: string;
}

export function ReviewForm({ orderId, targetName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Silakan pilih rating bintang terlebih dahulu");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("orderId", orderId);
    formData.append("rating", rating.toString());

    startTransition(async () => {
      try {
        await submitReviewAction(formData);
        toast.success("Ulasan berhasil dikirim!");
      } catch (error: any) {
        toast.error(error.message || "Gagal mengirim ulasan");
      }
    });
  };

  return (
    <div className="p-4 sm:p-5 border rounded-2xl bg-gradient-to-b from-card to-accent/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
          <IconStarFilled size={18} />
        </div>
        <h3 className="font-semibold text-sm">Berikan Ulasan</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Bagaimana pengalaman bekerja dengan <strong className="text-foreground">{targetName}</strong>?
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selection */}
        <div className="flex flex-col items-center justify-center p-4 bg-background border rounded-xl space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <IconStarFilled
                  size={32}
                  className={
                    star <= (hoveredRating || rating)
                      ? "text-amber-400 drop-shadow-sm"
                      : "text-muted/50"
                  }
                />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            {rating === 1 && "Sangat Buruk"}
            {rating === 2 && "Buruk"}
            {rating === 3 && "Cukup"}
            {rating === 4 && "Bagus"}
            {rating === 5 && "Sangat Bagus!"}
            {rating === 0 && "Pilih Rating"}
          </p>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-medium flex items-center gap-1.5">
            <IconMessageChatbot size={14} className="text-muted-foreground" />
            Tulis Testimoni (Opsional)
          </label>
          <Textarea
            name="comment"
            placeholder={`Ceritakan pengalaman Anda bekerja dengan ${targetName}...`}
            className="resize-none h-20 rounded-xl text-sm"
            disabled={isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || rating === 0}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all"
        >
          {isPending ? (
            <IconLoader2 className="animate-spin mr-2" size={16} />
          ) : null}
          Kirim Ulasan
        </Button>
      </form>
    </div>
  );
}
