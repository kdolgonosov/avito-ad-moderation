import { AnimatePresence } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ItemPage, ListPage, StatsPage } from '@/pages'
import { PageTransition } from '@/shared/ui'

export const AppRouter = () => {
    const location = useLocation()

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route path='/' element={<Navigate to='/list' replace />} />

                <Route
                    path='/list'
                    element={
                        <PageTransition>
                            <ListPage />
                        </PageTransition>
                    }
                />

                <Route
                    path='/item/:id'
                    element={
                        <PageTransition>
                            <ItemPage />
                        </PageTransition>
                    }
                />

                <Route
                    path='/stats'
                    element={
                        <PageTransition>
                            <StatsPage />
                        </PageTransition>
                    }
                />

                <Route path='*' element={<Navigate to='/list' replace />} />
            </Routes>
        </AnimatePresence>
    )
}
