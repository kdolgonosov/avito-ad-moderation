import { AnimatePresence } from 'motion/react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ListPage } from '@/pages'
import { PageLoader, PageTransition } from '@/shared/ui'

const ItemPage = lazy(() =>
    import('@/pages/item/ui/ItemPage').then(mod => ({
        default: mod.ItemPage,
    }))
)

const StatsPage = lazy(() =>
    import('@/pages/stats/ui/StatsPage').then(mod => ({
        default: mod.StatsPage,
    }))
)

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
                            <Suspense fallback={<PageLoader />}>
                                <ItemPage />
                            </Suspense>
                        </PageTransition>
                    }
                />

                <Route
                    path='/stats'
                    element={
                        <PageTransition>
                            <Suspense fallback={<PageLoader />}>
                                <StatsPage />
                            </Suspense>
                        </PageTransition>
                    }
                />

                <Route path='*' element={<Navigate to='/list' replace />} />
            </Routes>
        </AnimatePresence>
    )
}
