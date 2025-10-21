interface TypingIndicatorProps {
  sender: {
    name: string;
    avatarUrl?: string;
  };
}

export default function TypingIndicator({ sender }: TypingIndicatorProps) {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-end gap-2 sm:gap-3 animate-fadeIn">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {sender.avatarUrl ? (
          <img
            src={sender.avatarUrl}
            alt={`${sender.name}'s avatar`}
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover border-2 border-slate-200"
          />
        ) : (
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[#5aabba] to-[#4a9aaa] flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md">
            {getInitials(sender.name)}
          </div>
        )}
      </div>

      {/* Typing Animation Bubble */}
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 bg-[#5aabba] rounded-full animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "1s" }}
          ></span>
          <span
            className="w-2 h-2 bg-[#5aabba] rounded-full animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "1s" }}
          ></span>
          <span
            className="w-2 h-2 bg-[#5aabba] rounded-full animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "1s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}