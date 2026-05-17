export function auditMessage(action: string, actorName: string, target: string) {
  return `${actorName} performed ${action} on ${target}`;
}
