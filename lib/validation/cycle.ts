import { z } from "zod";

export const cycleSchema = z.object({
  name: z.string().min(3),
  goalSettingStart: z.string().min(1),
  goalSettingEnd: z.string().min(1),
  q1Start: z.string().min(1),
  q1End: z.string().min(1),
  q2Start: z.string().min(1),
  q2End: z.string().min(1),
  q3Start: z.string().min(1),
  q3End: z.string().min(1),
  q4Start: z.string().min(1),
  q4End: z.string().min(1)
});
