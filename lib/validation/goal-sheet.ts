import { z } from "zod";
import { scoreDirections, uomTypes } from "@/lib/domain/enums";

export const goalInputSchema = z.object({
  title: z.string().min(3, "Goal title is required."),
  description: z.string().min(1, "Goal description is required."),
  thrustArea: z.string().min(2, "Select a thrust area."),
  uomType: z.enum(uomTypes),
  scoreDirection: z.enum(scoreDirections).nullable().optional(),
  target: z.string().min(1, "Target is required."),
  weightage: z.coerce.number().min(10, "Minimum weightage per goal is 10%.").max(100),
  isShared: z.boolean().default(false)
});

export const goalSheetSchema = z.object({
  goals: z.array(goalInputSchema).min(1, "At least one goal is required.").max(8, "Maximum 8 goals are allowed.")
}).superRefine((value, ctx) => {
  const total = value.goals.reduce((sum, goal) => sum + goal.weightage, 0);
  if (total !== 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Total weightage must equal exactly 100%.",
      path: ["goals"]
    });
  }

  value.goals.forEach((goal, index) => {
    if ((goal.uomType === "numeric" || goal.uomType === "percentage") && !goal.scoreDirection) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Numeric and percentage goals need a score direction.",
        path: ["goals", index, "scoreDirection"]
      });
    }
  });
});

export type GoalSheetInput = z.infer<typeof goalSheetSchema>;
