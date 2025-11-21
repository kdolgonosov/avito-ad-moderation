import { motion } from 'motion/react'

export const AnimatedItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 12, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}
