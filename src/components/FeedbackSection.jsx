import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { AnalysisFeedback } from "@/entities/AnalysisFeedback";
import { User } from "@/entities/User";

export default function FeedbackSection({ analysisId }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmitFeedback = async () => {
        if (rating === 0) return;
        
        setIsSubmitting(true);
        try {
            const user = await User.me();
            await AnalysisFeedback.create({
                analysis_id: analysisId,
                rating: rating,
                feedback_comment: comment,
                user_email: user.email
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                    <div className="text-center space-y-3">
                        <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto" />
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Thank You!</h3>
                        <p className="text-green-700 dark:text-green-300">Your feedback helps improve our AI analysis accuracy.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Rate This Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">How accurate was this ST-RADS analysis?</p>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="p-1 hover:scale-110 transition-transform"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <Star
                                    className={`w-8 h-8 ${
                                        star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    } transition-colors`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="ml-3 text-blue-800 dark:text-blue-200 font-semibold">
                                {rating} star{rating !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-blue-800 dark:text-blue-200 font-medium block">
                        Additional Comments (Optional)
                    </label>
                    <Textarea
                        placeholder="Share your thoughts on the analysis accuracy, missed findings, or suggestions for improvement..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-blue-950/50"
                    />
                </div>

                <Button
                    onClick={handleSubmitFeedback}
                    disabled={rating === 0 || isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>

                <p className="text-sm text-blue-600 dark:text-blue-300 text-center">
                    Your feedback helps train our AI to provide more accurate ST-RADS classifications
                </p>
            </CardContent>
        </Card>
    );
}