import { LocalGuideVerificationList } from "@/components/admin/local-guide/LocalGuideVerificationList";

export default function LocalGuideVerificationPage() {
  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-gradient-to-br from-[#f1f5f9] to-[#f0f4f8] transition-all duration-300">
      <div className="p-4 lg:p-6 pt-16 lg:pt-6">
        <LocalGuideVerificationList />
      </div>
    </div>
  );
}



