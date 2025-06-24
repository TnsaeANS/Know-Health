import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfoDisplay() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Get in Touch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start">
          <MapPin className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Our Office</h3>
            <p className="text-muted-foreground">123 Health St, Bole Sub-City, Addis Ababa, Ethiopia</p>
          </div>
        </div>
        <div className="flex items-start">
          <Phone className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Call Us</h3>
            <p className="text-muted-foreground">+251-11-555-1234</p>
          </div>
        </div>
        <div className="flex items-start">
          <Mail className="h-6 w-6 mr-3 mt-1 text-primary flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground">Email Us</h3>
            <p className="text-muted-foreground">info@knowhealth.com</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
