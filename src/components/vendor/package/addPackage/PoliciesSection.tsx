import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";


export default function PoliciesSection({ cancellationPolicy, termsAndConditions, setFieldValue, errors, touched }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="cancellationPolicy">Cancellation Policy *</Label>
        <Textarea
          id="cancellationPolicy"
          value={cancellationPolicy}
          onChange={(e) => setFieldValue("basicDetails.cancellationPolicy", e.target.value)}
          placeholder="Free cancellation up to 24 hours before the tour..."
          rows={4}
          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
        />
        {touched.basicDetails?.cancellationPolicy && errors.basicDetails?.cancellationPolicy && (
          <p className="text-red-500 text-sm">{errors.basicDetails.cancellationPolicy}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="termsAndConditions">Terms & Conditions *</Label>
        <Textarea
          id="termsAndConditions"
          value={termsAndConditions}
          onChange={(e) => setFieldValue("basicDetails.termsAndConditions", e.target.value)}
          placeholder="Terms and conditions for this package..."
          rows={4}
          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
        />
        {touched.basicDetails?.termsAndConditions && errors.basicDetails?.termsAndConditions && (
          <p className="text-red-500 text-sm">{errors.basicDetails.termsAndConditions}</p>
        )}
      </div>
    </div>
  )
}