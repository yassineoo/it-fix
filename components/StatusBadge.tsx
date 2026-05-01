import type { TicketPriority, TicketStatus } from "@/lib/types";

const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Ouvert",
  in_progress: "En cours",
  resolved: "Résolu",
  cancelled: "Annulé"
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente"
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`badge badge-${priority}`}>{PRIORITY_LABEL[priority]}</span>
  );
}
