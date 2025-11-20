import React from 'react'
import { ErrorFallback } from './ErrorFallback'

interface AppErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

interface AppErrorBoundaryProps {
    children: React.ReactNode
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    constructor(props: AppErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Здесь можно залогировать ошибку в сторонний сервис
        console.error('AppErrorBoundary caught an error:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback onReset={this.handleReset} />
        }

        return this.props.children
    }
}
