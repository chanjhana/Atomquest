import { getSharedGoals, getUserById } from "./demo-store";

export function describeSharedGoal(groupId?: string | null) {
  const group = getSharedGoals().find((item) => item.id === groupId);
  if (!group) return null;
  const owner = getUserById(group.primaryOwnerUserId);
  return {
    ...group,
    primaryOwnerName: owner?.name ?? "Primary owner"
  };
}
