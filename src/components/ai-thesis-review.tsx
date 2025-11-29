"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reviewThesis } from "@/ai/flows/ai-thesis-review";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  thesis: z.string().min(20, "Please provide a more detailed thesis for a better review."),
});

type AIThesisReviewProps = {
  thesis: string;
};

export function AIThesisReview({ thesis }: AIThesisReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thesis: thesis || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const result = await reviewThesis(values);
      setFeedback(result.feedback);
    } catch (error) {
      console.error("AI Thesis Review Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get feedback from AI. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
          <Sparkles className="mr-2 h-4 w-4" />
          AI Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wand2 className="text-primary" />
            AI Thesis Reviewer
          </DialogTitle>
          <DialogDescription>
            Get instant feedback on your trading thesis to identify blind spots and refine your strategy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="thesis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Thesis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I believe the market is underpricing the risk of..."
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Review Thesis
              </Button>
            </form>
          </Form>
          <div className="flex flex-col">
            <h3 className="mb-2 text-sm font-medium">AI Feedback</h3>
            <Card className="flex-grow">
              <ScrollArea className="h-[268px]">
                <CardContent className="p-4 text-sm">
                  {isSubmitting && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <Wand2 className="mx-auto h-8 w-8 animate-pulse text-primary"/>
                            <p className="mt-2">Analyzing your thesis...</p>
                        </div>
                    </div>
                  )}
                  {feedback && <p className="whitespace-pre-wrap">{feedback}</p>}
                  {!isSubmitting && !feedback && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground p-4">
                            <p>Your feedback will appear here.</p>
                        </div>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
