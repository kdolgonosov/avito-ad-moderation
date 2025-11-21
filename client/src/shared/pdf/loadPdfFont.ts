import jsPDF from 'jspdf'

let fontLoaded = false

export const loadPdfFont = async (doc: jsPDF) => {
    if (fontLoaded) return

    const res = await fetch('/fonts/Roboto-Regular.ttf')
    if (!res.ok) {
        console.error('Не удалось загрузить шрифт для PDF', res.status)
        return
    }

    const buf = await res.arrayBuffer()
    const bytes = new Uint8Array(buf)

    // конвертация в base64
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    const base64 = btoa(binary)

    // регистрация шрифта
    ;(doc as any).addFileToVFS('Roboto-Regular.ttf', base64)
    ;(doc as any).addFont('Roboto-Regular.ttf', 'Roboto', 'normal')

    fontLoaded = true
}
