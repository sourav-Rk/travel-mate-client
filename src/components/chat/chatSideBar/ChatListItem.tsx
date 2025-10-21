"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { ChatListItemDTO } from "@/types/chat"


function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ""
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
  return (first + last).toUpperCase()
}

function formatTimeAgo(iso?: string) {
  if (!iso) return ""
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return "now"
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  return `${day}d`
}

function StatusDot({ status }: { status?: "sent" | "delivered" | "read" }) {
  // bg-primary: unread/new, bg-muted-foreground for delivered, ring for read
  const color =
    status === "read"
      ? "bg-transparent ring-2 ring-primary"
      : status === "delivered"
        ? "bg-muted-foreground"
        : "bg-primary"
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", color)} aria-hidden />
}

export function ChatListItem({
  item,
  active,
  onClick,
}: {
  item: ChatListItemDTO
  active?: boolean
  onClick?: () => void
}) {
  const initials = getInitials(item.peerInfo.firstName)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md p-3 text-left transition-colors",
        active
          ? "bg-[var(--color-chat-item-active)] text-[var(--color-chat-item-active-foreground)]"
          : "hover:bg-[var(--color-chat-item-hover)]",
      )}
      aria-label={`Open chat with ${item.peerInfo.firstName}`}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={item.peerInfo.profileImage || "/placeholder.svg?height=40&width=40&query=profile%20avatar"}
            alt={item.peerInfo.firstName}
          />
          <AvatarFallback className="font-medium">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("truncate font-medium", active ? "" : "text-[var(--color-chat-text-primary)]")}>
              {item.peerInfo.firstName}
            </p>
            <span className={cn("shrink-0 text-xs", active ? "opacity-90" : "text-[var(--color-chat-text-secondary)]")}>
              {formatTimeAgo(item.lastMessageAt)}
            </span>
          </div>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className={cn("truncate text-sm", active ? "opacity-90" : "text-[var(--color-chat-text-secondary)]")}>
              {item.lastMessage || ""}
            </p>
            {/* <div className="flex items-center gap-2">
              {typeof item.unreadCount === "number" && item.unreadCount > 0 ? (
                <span
                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground"
                  aria-label={`${item.unreadCount} unread messages`}
                >
                  {item.unreadCount}
                </span>
              ) : (
                <>
                  {item.lastMessageStatus === "read" && item.lastMessageReadAt ? (
                    <span
                      className={cn("text-xs", active ? "opacity-90" : "text-[var(--color-chat-text-secondary)]")}
                      aria-label={`Read ${formatTimeAgo(item.lastMessageReadAt)} ago`}
                    >
                      {"Read "}
                      {formatTimeAgo(item.lastMessageReadAt)}
                    </span>
                  ) : null}
                  <StatusDot status={item.lastMessageStatus} />
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </button>
  )
}
