import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScheduleViewingModalProps {
  property: Property;
  trigger?: React.ReactNode;
}

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please select a time" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Type for the API request
interface ViewingRequestData {
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  date: string; // This is a string in yyyy-MM-dd format
  time: string;
  notes?: string;
}

export default function ScheduleViewingModal({ property, trigger }: ScheduleViewingModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
      // Time needs a default value to avoid controlled/uncontrolled component warnings
      time: undefined,
      // Date will be selected via calendar
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (values: ViewingRequestData) => {
      const res = await apiRequest("POST", "/api/schedule-viewing", values);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to schedule viewing");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Viewing scheduled!",
        description: "We'll contact you shortly to confirm your appointment.",
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
    // Only submit if we have a valid date
    if (!values.date) {
      toast({
        title: "Error",
        description: "Please select a date for your viewing",
        variant: "destructive",
      });
      return;
    }
    
    // Validate time selection
    if (!values.time) {
      toast({
        title: "Error",
        description: "Please select a time for your viewing",
        variant: "destructive",
      });
      return;
    }
    
    // Create the request data with the proper types
    const requestData: ViewingRequestData = {
      propertyId: property.id,
      name: values.name,
      email: values.email,
      phone: values.phone,
      date: format(values.date, "yyyy-MM-dd"),
      time: values.time,
      notes: values.notes,
    };
    
    mutation.mutate(requestData);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule a Viewing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-[500px] p-0"
        aria-describedby="schedule-viewing-description"
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-serif">Schedule a Viewing</DialogTitle>
          <DialogDescription id="schedule-viewing-description">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("date") && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("date") ? (
                        format(form.watch("date"), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch("date")}
                      onSelect={(date) => form.setValue("date", date as Date)}
                      disabled={(date) => {
                        // Disable dates in the past and weekends
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const day = date.getDay();
                        return date < today || day === 0 || day === 6;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {form.formState.errors.date && (
                  <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Time</Label>
                <Select 
                  onValueChange={(value) => form.setValue("time", value)}
                  value={form.watch("time") || ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.time && (
                  <p className="text-sm text-red-500">{form.formState.errors.time.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea 
                id="notes"
                placeholder="Any specific questions or requests?"
                className="resize-none"
                {...form.register("notes")}
              />
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
              {mutation.isPending ? "Submitting..." : "Schedule Viewing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}