import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, CreditCard, Mail, Phone } from "lucide-react"
import {Link, useNavigate} from "react-router-dom";

export default function PaymentCancelled() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Main Content Card */}
        <Card className="border-0 shadow-2xl bg-card">
          <CardContent className="p-8 md:p-12 text-center">
            {/* Icon and Status */}
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Payment Failed</h1>
              <p className="text-lg text-muted-foreground mb-2 text-pretty">
                We're sorry, but your payment could not be processed.
              </p>
              <p className="text-muted-foreground text-pretty">
                This can happen for various reasons, and we're here to help you complete your purchase.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Retry Payment
              </Button>
              <Button onClick={() => navigate("/home")} variant="outline" size="lg" className="border-2 font-semibold px-8 py-3 bg-transparent">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Home
              </Button>
            </div>

            {/* Common Issues Section */}
            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4">Common reasons for payment failure:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Insufficient funds in your account
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Incorrect card details or expired card
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Bank security restrictions
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Network connectivity issues
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="border-t border-border pt-8">
              <h3 className="font-semibold text-foreground mb-4">Need help?</h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                Our support team is ready to assist you with your payment issues.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Mail className="w-4 h-4" />
                  Email Support
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Phone className="w-4 h-4" />
                  Call Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Trust Elements */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <Link to="/security" className="hover:text-foreground transition-colors">
              🔒 Secure Payments
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              🛡️ Privacy Protected
            </Link>
            <Link to="/support" className="hover:text-foreground transition-colors">
              💬 24/7 Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
