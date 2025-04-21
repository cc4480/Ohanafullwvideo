import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Define form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  interest: z.string().min(1, { message: "Please select your interest" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactSectionProps {
  hideTitle?: boolean;
  propertyInquiry?: string;
}

export default function ContactSection({ hideTitle = false, propertyInquiry }: ContactSectionProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  // Define form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: propertyInquiry ? "Buying a property" : "",
      message: propertyInquiry ? `I'm interested in the property at ${propertyInquiry}. Please contact me with more information.` : "",
    },
  });
  
  // Define mutation
  const contactMutation = useMutation({
    mutationFn: (values: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", values);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
      });
      form.reset();
      setSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setSubmitting(false);
      console.error("Contact form error:", error);
    }
  });
  
  // Handle form submission
  const onSubmit = (values: ContactFormValues) => {
    setSubmitting(true);
    contactMutation.mutate(values);
  };
  
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {!hideTitle && (
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              Contact Valentin Cuellar
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Whether you're looking to buy, sell, or simply have questions about the Laredo real estate market, 
              Valentin is here to help.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Get in Touch</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800 mt-2 mb-6">
              Contact Valentin Cuellar
            </h2>
            <p className="text-neutral-600 mb-8">
              Whether you're looking to buy, sell, or simply have questions about the Laredo real estate market, 
              Valentin is here to help.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary-light bg-opacity-10 p-3 rounded-full mr-4">
                  <i className='bx bx-map text-primary'></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Office Address</h3>
                  <p className="text-neutral-600">505 Shiloh Dr, Apt 201<br />Laredo, TX 78045</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-light bg-opacity-10 p-3 rounded-full mr-4">
                  <i className='bx bx-phone text-primary'></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Phone</h3>
                  <p className="text-neutral-600">Office: <a href="tel:+19567123000" className="hover:text-primary">956-712-3000</a></p>
                  <p className="text-neutral-600">Mobile: <a href="tel:+19563246714" className="hover:text-primary">956-324-6714</a></p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary-light bg-opacity-10 p-3 rounded-full mr-4">
                  <i className='bx bx-time text-primary'></i>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-800 mb-1">Business Hours</h3>
                  <p className="text-neutral-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-neutral-600">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-neutral-600">Sunday: By appointment</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-primary-light bg-opacity-10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition"
                aria-label="Facebook"
              >
                <i className='bx bxl-facebook text-xl'></i>
              </a>
              <a 
                href="#" 
                className="bg-primary-light bg-opacity-10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition"
                aria-label="Instagram"
              >
                <i className='bx bxl-instagram text-xl'></i>
              </a>
              <a 
                href="#" 
                className="bg-primary-light bg-opacity-10 p-3 rounded-full text-primary hover:bg-primary hover:text-white transition"
                aria-label="LinkedIn"
              >
                <i className='bx bxl-linkedin text-xl'></i>
              </a>
            </div>
          </div>
          
          <div>
            <div className="bg-neutral-50 p-8 rounded-lg shadow-md">
              <h3 className="font-serif text-2xl font-bold text-neutral-800 mb-6">Send a Message</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I'm interested in</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your interest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Buying a property">Buying a property</SelectItem>
                            <SelectItem value="Selling a property">Selling a property</SelectItem>
                            <SelectItem value="Property valuation">Property valuation</SelectItem>
                            <SelectItem value="General inquiry">General inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    className="w-full" 
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className='bx bx-loader-alt animate-spin mr-2'></i>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
