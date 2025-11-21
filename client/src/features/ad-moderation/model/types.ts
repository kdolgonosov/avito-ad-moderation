export const ModerationDialogMode = {
    Reject: 'reject',
    Changes: 'changes',
} as const
export type ModerationDialogMode = (typeof ModerationDialogMode)[keyof typeof ModerationDialogMode]
