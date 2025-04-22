import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HelpCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PropertyInquiryModalProps {
  property: Property;
  trigger?: React.ReactNode;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  questions: z.string().min(5, { message: "Please enter your questions or message" }),
});

type FormValues = z.infer<typeof formSchema>;

// Type for the API request
interface InquiryRequestData {
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  questions: string;
}

export default function PropertyInquiryModal({ property, trigger }: PropertyInquiryModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      questions: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (values: InquiryRequestData) => {
      const res = await apiRequest("POST", "/api/property-inquiry", values);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit inquiry");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry submitted!",
        description: "Thank you for your interest. Our agent will contact you shortly.",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: FormValues) => {
    // Create the request data with the proper types
    const requestData: InquiryRequestData = {
      propertyId: property.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      questions: values.questions,
    };
    
    mutation.mutate(requestData);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full">
            <HelpCircle className="mr-2 h-4 w-4" />
            Ask About This Property
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-serif">Property Inquiry</DialogTitle>
          <DialogDescription>
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name"
                placeholder="Enter your full name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  placeholder="(123) 456-7890"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questions">Questions or Message</Label>
              <Textarea 
                id="questions"
                placeholder="What would you like to know about this property?"
                className="resize-none min-h-[120px]"
                {...form.register("questions")}
              />
              {form.formState.errors.questions && (
                <p className="text-sm text-red-500">{form.formState.errors.questions.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="ml-2"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Send Inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}