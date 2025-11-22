import jsPDF from 'jspdf'

let fontBase64Promise: Promise<string> | null = null

const loadFontBase64 = () => {
    if (!fontBase64Promise) {
        fontBase64Promise = (async () => {
            const res = await fetch('/fonts/Roboto-Regular.ttf')

            if (!res.ok) {
                console.error('Не удалось загрузить шрифт для PDF', res.status)
                throw new Error('Font load failed')
            }

            const buf = await res.arrayBuffer()
            const bytes = new Uint8Array(buf)

            let binary = ''
            for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i])
            }

            return btoa(binary)
        })()
    }

    return fontBase64Promise
}

export const loadPdfFont = async (doc: jsPDF) => {
    const base64 = await loadFontBase64()

    ;(doc as any).addFileToVFS('Roboto-Regular.ttf', base64)
    ;(doc as any).addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
}
