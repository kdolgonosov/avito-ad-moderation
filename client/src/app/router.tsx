import { Navigate, Route, Routes } from 'react-router-dom'
import { ItemPage, ListPage, StatsPage } from '@/pages'

export const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/list' replace />} />
            <Route path='/list' element={<ListPage />} />
            <Route path='/item/:id' element={<ItemPage />} />
            <Route path='/stats' element={<StatsPage />} />
            <Route path='*' element={<Navigate to='/list' replace />} />
        </Routes>
    )
}
