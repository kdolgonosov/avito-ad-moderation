import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { StatsPeriod } from '@/entities/stats/model/types'
import { loadPdfFont } from '@/shared/pdf/loadPdfFont'
import { PERIOD_LABELS } from '../model/constants'

interface ExportPdfParams {
    container: HTMLDivElement
    period: StatsPeriod
}

export const exportStatsPdf = async ({ container, period }: ExportPdfParams) => {
    const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    // подгрузка шрифта
    await loadPdfFont(pdf)
    pdf.setFont('Roboto', 'normal')

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const marginX = 10
    const headerY = 15

    pdf.setFontSize(18)
    pdf.text('Отчёт по модерации объявлений', marginX, headerY)

    pdf.setFontSize(12)
    pdf.text(`Период: ${PERIOD_LABELS[period]}`, marginX, headerY + 8)

    const imageTop = headerY + 20
    const maxImageHeight = pageHeight - imageTop - 10

    const fullImgWidth = pageWidth - marginX * 2
    const fullImgHeight = (canvas.height * fullImgWidth) / canvas.width

    let renderWidth = fullImgWidth
    let renderHeight = fullImgHeight

    if (fullImgHeight > maxImageHeight) {
        const ratio = maxImageHeight / fullImgHeight
        renderWidth = fullImgWidth * ratio
        renderHeight = maxImageHeight
    }

    const x = (pageWidth - renderWidth) / 2

    pdf.addImage(imgData, 'PNG', x, imageTop, renderWidth, renderHeight)

    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
}
