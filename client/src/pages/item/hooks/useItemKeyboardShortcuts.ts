import { useEffect } from 'react'

interface UseItemKeyboardShortcutsParams {
    isPrevDisabled: boolean
    isNextDisabled: boolean
    onPrev: () => void
    onNext: () => void
}

export const useItemKeyboardShortcuts = ({ isPrevDisabled, isNextDisabled, onPrev, onNext }: UseItemKeyboardShortcutsParams) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // игнорируем сочетания с модификаторами
            if (event.altKey || event.ctrlKey || event.metaKey) return

            const target = event.target as HTMLElement | null
            if (target) {
                const tag = target.tagName
                const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable

                if (isTyping) return
            }

            if (event.key === 'ArrowRight' && !isNextDisabled) {
                event.preventDefault()
                onNext()
            }

            if (event.key === 'ArrowLeft' && !isPrevDisabled) {
                event.preventDefault()
                onPrev()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isPrevDisabled, isNextDisabled, onPrev, onNext])
}
