export type TicketStatus = "open" | "in_progress" | "resolved" | "cancelled";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export type Employee = {
  id: string;
  full_name: string;
  department: string | null;
  created_at: string;
};

export type Technician = {
  id: string;
  full_name: string;
  speciality: string;
  email: string | null;
  phone: string | null;
  available: boolean;
  created_at: string;
};

export type Ticket = {
  id: string;
  employee_id: string;
  technician_id: string;
  title: string;
  description: string;
  screenshot_path: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  resolved_at: string | null;
};

export type TicketWithTechnician = Ticket & {
  technicians: Pick<Technician, "id" | "full_name" | "speciality"> | null;
};
