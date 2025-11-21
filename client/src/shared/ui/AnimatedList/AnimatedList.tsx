import { motion } from 'motion/react'

export const AnimatedList = ({ listKey, children }: { listKey: string; children: React.ReactNode }) => {
    return (
        <motion.div
            key={listKey}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: 0.06,
                    },
                },
            }}
            initial='hidden'
            animate='show'
        >
            {children}
        </motion.div>
    )
}
