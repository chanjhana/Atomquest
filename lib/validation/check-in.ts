import { z } from "zod";
import { goalStatuses, quarters } from "@/lib/domain/enums";

export const checkInSchema = z.object({
  goalId: z.string().min(1),
  quarter: z.enum(quarters),
  actualValue: z.string().min(1, "Actual achievement is required."),
  status: z.enum(goalStatuses),
  employeeComment: z.string().max(500).optional()
});

export const managerCheckInSchema = z.object({
  employeeId: z.string().min(1),
  quarter: z.enum(quarters),
  managerComment: z.string().min(8, "Manager comment is required to complete review.")
});
