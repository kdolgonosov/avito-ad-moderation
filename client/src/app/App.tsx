import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router'
import { AppErrorBoundary } from '@/shared/components/ErrorBoundary/AppErrorBoundary'
import { Layout } from '@/shared/ui'
import { Providers } from './providers/providers'

export const App = () => {
    return (
        <AppErrorBoundary>
            <Providers>
                <BrowserRouter>
                    <Layout>
                        <AppRouter />
                    </Layout>
                </BrowserRouter>
            </Providers>
        </AppErrorBoundary>
    )
}
