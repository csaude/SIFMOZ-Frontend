import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'
// import { saveAs } from 'file-saver'
// import * as ExcelJS from 'exceljs'
import reportService from 'src/store/models/report/Report'

/* const logoTitle =
  'REPÚBLICA DE MOÇAMBIQUE \n MINISTÉRIO DA SAÚDE \n CENTRAL DE MEDICAMENTOS E ARTIGOS MÉDICOS'
const title = 'MMIA \n MAPA MENSAL DE INFORMAÇÃO ARV' */
const reportName = 'MMIA'
const fileName = reportName

export default {
  async downloadPDF (
    reportId
  ) {
    const doc = new JsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 'smart' // or "smart", default is 16
    })
    doc.setFontSize(10)
    const image = new Image()
    image.src = require('src/assets/MoHLogo.png')
    // const width = doc.internal.pageSize.getWidth()
    /*
      Fill Table
    */
    const cols = [
      'FNM',
      'MEDICAMENTO',
      'Unidade',
      'Saldo Inicial',
      'Entradas',
      'Saídas',
      'Perdas e Ajustes',
      'Inventário',
      'Validade'
    ]
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

  reportService.apiGetMmiaReport(reportId).then(resp => {
    const mmiaData = resp.response.data
    const month = months[new Date(mmiaData.endDate).getMonth()]

    const regimenCols = [
      'Código',
      'Regime Terapêutico',
      'Total doentes',
      'Farmácia Comunitária'
    ]

      const headData = []
      const row1 = []
      const row2 = []
      const row3 = []
      row1.push(image)
      row1.push({
        content: 'REPÚBLICA DE MOÇAMBIQUE \nMINISTÉRIO DA SAÚDE \nCENTRAL DE MEDICAMENTOS E ARTIGOS MÉDICOS',
        styles: { halign: 'left', valign: 'middle', fontStyle: 'bold' }
      })
      row1.push({
        content: 'MMIA \n MAPA MENSAL DE INFORMAÇÃO ARV',
        styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: 0 }
      })
      row1.push({
        content: 'Mês: ' + month,
        styles: { valign: 'middle', halign: 'center', fontStyle: 'bold', textColor: 0 }
      })

      row2.push({
        content: 'Unidade Sanitária: ' + mmiaData.clinic.clinicName,
        colSpan: 3,
        styles: { halign: 'left', fontStyle: 'bold', textColor: 0 }
      })

      row3.push({
        colSpan: 2,
        content: 'Distrito: ' + mmiaData.clinic.district.description,
        styles: { halign: 'left', fontStyle: 'bold', textColor: 0 }
      })
      row3.push({
        content: 'Província: ' + mmiaData.clinic.province.description,
        styles: { halign: 'left', fontStyle: 'bold', textColor: 0 }
      })
      row2.push({
        rowSpan: 2,
        content: 'Ano: ' + mmiaData.year,
        styles: { valign: 'middle', halign: 'center', fontStyle: 'bold', textColor: 0 }
      })

      headData.push(row1)
      headData.push(row2)
      headData.push(row3)

      const stockdata = this.createArrayOfArrayRow(mmiaData.mmiaStockSubReportItemList)
      const regimendata = this.createRegimenArrayOfArrayRow(mmiaData.mmiaRegimenSubReportList)
      const miaTipoDoenteData = this.createMmiaTipoDoentesArrayRow(mmiaData)
      const miaFaixaEtariaData = this.createMmiaFaixaEtariaArrayRow(mmiaData)
      const miaProfilaxiaData = this.createMmiaProfilaxiaArrayRow(mmiaData)
      const miaRegimenTotalData = this.createRegimenTotalArrayRow(mmiaData.mmiaRegimenSubReportList)
      const miaLinesSumaryData = this.createLinesSumaryArrayRow(mmiaData.mmiaRegimenSubReportList)
      const miaLinesSumaryTotalData = this.createLinesSumaryTotalArrayRow(mmiaData.mmiaRegimenSubReportList)
      const mmiadsTypeData = this.createMmiaDispenseTypeDSArrayRow(mmiaData)
      const mmiadtTypeData = this.createMmiaDispenseTypeDTArrayRow(mmiaData)
      const mmiadmTypeData = this.createMmiaDispenseTypeDMArrayRow(mmiaData)
      const mmiaAjusteData = this.createMmiaAjustePercentageArrayRow(mmiaData)
      const footer = this.createFotterTableRow()

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 14 }
        },
        styles: {
          maxCellHeight: 4
        },
        body: headData,
        startY: 10
      })
      autoTable(doc, {
        theme: 'grid',
        styles: {
          maxCellHeight: 4
        },
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 13 },
          1: { halign: 'left' },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 16 },
          5: { cellWidth: 13 },
          6: { cellWidth: 16 },
          7: { cellWidth: 17 },
          8: { cellWidth: 17 }
        },
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 8
        },
        head: [cols],
        body: stockdata,
        startY: doc.lastAutoTable.finalY
      })

      const newY = doc.lastAutoTable.finalY
      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 13 },
          2: { cellWidth: 15 },
          3: { cellWidth: 18 }
        },
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        head: [regimenCols],
        body: regimendata,
        startY: newY + 1,
        margin: { right: 90.1 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          2: { cellWidth: 15 },
          3: { cellWidth: 18 }
        },
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        body: miaRegimenTotalData,
        startY: doc.lastAutoTable.finalY,
        margin: { right: 90.1 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          2: { cellWidth: 15 },
          3: { cellWidth: 18 }
        },
        head: [
          [
            {
              content: 'Linhas Terapêuticas',
              colSpan: 4,
              styles: { halign: 'center', fillColor: [22, 160, 133] }
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        body: miaLinesSumaryData,
        startY: doc.lastAutoTable.finalY,
        margin: { right: 90.1 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          2: { cellWidth: 15 },
          3: { cellWidth: 18 }
        },
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        body: miaLinesSumaryTotalData,
        startY: doc.lastAutoTable.finalY,
        margin: { right: 90.1 }
      })
     // const regimenTableY = doc.lastAutoTable.finalY

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { halign: 'left' },
          1: { cellWidth: 30 }
        },
        head: [
          [
            {
              content: 'Tipo de doentes em TARV',
              colSpan: 2,
              styles: { halign: 'center', fillColor: [22, 160, 133] }
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        body: miaTipoDoenteData,
        startY: newY + 1,
        margin: { left: 122 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { halign: 'left' },
          1: { cellWidth: 30 }
        },
        head: [
          [
            {
              content: 'Faixa Etária dos Pacientes TARV',
              colSpan: 2,
              styles: { halign: 'center', fillColor: [22, 160, 133] }
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        body: miaFaixaEtariaData,
        startY: doc.lastAutoTable.finalY,
        margin: { left: 122 }
      })
      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { halign: 'left' },
          1: { cellWidth: 30 }
        },
        head: [
          [
            {
              content: 'Profilaxia',
              colSpan: 2,
              styles: { halign: 'center', fillColor: [22, 160, 133] }
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 2
        },
        body: miaProfilaxiaData,
        startY: doc.lastAutoTable.finalY,
        margin: { left: 122 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        head: [
          [
            {
              content: 'Tipo de Dispensa',
              styles: { halign: 'center', fillColor: [22, 160, 133] }
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        styles: {
          maxCellHeight: 4
        },
        startY: doc.lastAutoTable.finalY,
        margin: { left: 122 }
      })

      const dsStartY = doc.lastAutoTable.finalY

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        head: [
          [
            {
              content: ''
            },
            {
              content: 'DS'
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'right', fillColor: [22, 160, 133] },
          1: { cellWidth: 15 }
        },
        styles: {
          maxCellHeight: 2
        },
        body: mmiadsTypeData,
        startY: dsStartY,
        margin: { left: 122 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        head: [
          [
            {
              content: 'DT'
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 15 }
        },
        styles: {
          maxCellHeight: 2
        },
        body: mmiadtTypeData,
        startY: dsStartY + 19.1,
        margin: { left: 157 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        head: [
          [
            {
              content: 'DM'
            },
            {
              content: 'Total'
            }
          ]
        ],
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 13 }
        },
        styles: {
          maxCellHeight: 2
        },
        body: mmiadmTypeData,
        startY: dsStartY + 31.8,
        margin: { left: 172 }
      })

      const dmTableY = doc.lastAutoTable.finalY

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 13, halign: 'right', fillColor: [22, 160, 133] }
        },
        styles: {
          maxCellHeight: 2
        },
        body: mmiaAjusteData,
        startY: dsStartY + 6,
        margin: { left: 172 }
      })

      autoTable(doc, {
        theme: 'striped',
        bodyStyles: {
          halign: 'center',
          fontSize: 7
        },
        columnStyles: {
          0: { halign: 'left' }
        },
        styles: {
          maxCellHeight: 2
        },
        body: [['Observaçãoes:'], ['']],
        startY: dmTableY + 1,
        margin: { left: 122 }
      })

      autoTable(doc, {
        theme: 'grid',
        bodyStyles: {
          halign: 'left',
          fontSize: 7
        },
        columnStyles: {
          1: { cellWidth: 60 },
          2: { cellWidth: 55 }
        },
        styles: {
          maxCellHeight: 2
        },
        body: footer,
        startY: doc.lastAutoTable.finalY + 2
      })
      doc.setFontSize(7)
      doc.text('Nota: Mapa de Preenchimento Obrigatório Mensal pela Farmácia da Unidade Sanitária \nVersão no 8 19 Nov 2019 DS TLD90 MDS e ARVs de nova geração', 15, doc.lastAutoTable.finalY + 5)
      doc.addImage(image, 'PNG', 16, 11, 10, 10)

      // Footer
      const str = 'Página ' + doc.internal.getNumberOfPages()

      doc.setFontSize(8)

      const pageSize = doc.internal.pageSize
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
      doc.text(str, 15, pageHeight - 10)
      // params.value.loading.loading.hide()
      return doc.save(fileName.concat('.pdf'))
    })
  },
  createArrayOfArrayRow (rows) {
    const data = []

    for (const row in rows) {
      const createRow = []
      createRow.push(rows[row].fnmCode)
      createRow.push(rows[row].drugName)
      createRow.push(rows[row].unit)
      createRow.push(rows[row].balance)
      createRow.push(rows[row].initialEntrance)
      createRow.push(rows[row].outcomes)
      createRow.push(rows[row].lossesAdjustments)
      createRow.push(rows[row].inventory)
      createRow.push(moment(rows[row].expireDate).format('DD-MM-YYYY'))

      data.push(createRow)
    }

    return data
  },
  createRegimenArrayOfArrayRow (rows) {
    const data = []

    for (const row in rows) {
      const createRow = []
      createRow.push(rows[row].lineCode + 'a Linha')
      createRow.push(rows[row].regimen)
      createRow.push(rows[row].totalPatients)
      createRow.push(rows[row].cumunitaryClinic)

      data.push(createRow)
    }

    return data
  },
  createMmiaTipoDoentesArrayRow (rows) {
    const data = []

    const createRow1 = []
    const createRow2 = []
    const createRow3 = []
    const createRow4 = []
    const createRow5 = []

    createRow1.push('Novos')
    createRow1.push(rows.totalPacientesInicio)
    createRow2.push('Manutenção')
    createRow2.push(rows.totalPacientesManter)
    createRow3.push('Alteração')
    createRow3.push(rows.totalPacientesAlterar)
    createRow4.push('Trânsito')
    createRow4.push(rows.totalPacientesTransito)
    createRow5.push('Transferências')
    createRow5.push(rows.totalPacientesTransferidoDe)

    data.push(createRow1)
    data.push(createRow2)
    data.push(createRow3)
    data.push(createRow4)
    data.push(createRow5)

    return data
  },
  createMmiaFaixaEtariaArrayRow (rows) {
    const data = []

    const createRow1 = []
    const createRow2 = []
    const createRow3 = []
    const createRow4 = []

    createRow1.push('Adultos')
    createRow1.push(rows.totalPacientesAdulto)
    createRow2.push('Pediátricos 0 aos 4')
    createRow2.push(rows.totalPacientes04)
    createRow3.push('Pediátricos 5 aos 9')
    createRow3.push(rows.totalPacientes59)
    createRow4.push('Pediátricos 10 aos 14')
    createRow4.push(rows.totalPacientes1014)

    data.push(createRow1)
    data.push(createRow2)
    data.push(createRow3)
    data.push(createRow4)

    return data
  },
  createMmiaProfilaxiaArrayRow (rows) {
    const data = []

    const createRow1 = []
    const createRow2 = []
    const createRow3 = []
    const createRow4 = []

    createRow1.push('PPE')
    createRow1.push(rows.totalPacientesPPE)
    createRow2.push('PrEP')
    createRow2.push(rows.totalPacientesPREP)
    createRow3.push('Crianças Expostas')
    createRow3.push(rows.totalpacientesCE)
    createRow4.push('Total de pacientes em TARV na US')
    createRow4.push('Ver Resumo Mensal')

    data.push(createRow1)
    data.push(createRow2)
    data.push(createRow3)
    data.push(createRow4)

    return data
  },
  createRegimenTotalArrayRow (rows) {
    const data = []
    let totalPatients = 0
    let cumunitaryClinic = 0

    for (const row in rows) {
      totalPatients += rows[row].totalPatients
      cumunitaryClinic += rows[row].cumunitaryClinic
    }
    const createRow = []
    createRow.push({
                    colSpan: 2,
                    content: 'Total',
                    styles: { halign: 'right', fillColor: [204, 204, 204] }
                  })
    createRow.push(totalPatients)
    createRow.push(cumunitaryClinic)

    data.push(createRow)

    return data
  },
  createLinesSumaryArrayRow (rows) {
    const data = []
    let totallinha1Nr = 0
    let totallinha2Nr = 0
    let totallinha3Nr = 0
    let totallinha1DC = 0
    let totallinha2DC = 0
    let totallinha3DC = 0

    for (const row in rows) {
      if (rows[row].lineCode === '1') {
        totallinha1Nr += rows[row].totalPatients
        totallinha1DC += rows[row].cumunitaryClinic
      } else if (rows[row].lineCode === '2') {
        totallinha2Nr += rows[row].totalPatients
        totallinha2DC += rows[row].cumunitaryClinic
      } else if (rows[row].lineCode === '3') {
        totallinha3Nr += rows[row].totalPatients
        totallinha3DC += rows[row].cumunitaryClinic
      }
    }
    const createRow1 = []
    const createRow2 = []
    const createRow3 = []
    createRow1.push({
                      colSpan: 2,
                      content: '1as Linhas',
                      styles: { halign: 'right' }
                    })
    createRow1.push(totallinha1Nr)
    createRow1.push(totallinha1DC)

    createRow2.push({
                      colSpan: 2,
                      content: '2as Linhas',
                      styles: { halign: 'right' }
                    })
    createRow2.push(totallinha2Nr)
    createRow2.push(totallinha2DC)

    createRow3.push({
                      colSpan: 2,
                      content: '3as Linhas',
                      styles: { halign: 'right' }
                    })
    createRow3.push(totallinha3Nr)
    createRow3.push(totallinha3DC)

    data.push(createRow1)
    data.push(createRow2)
    data.push(createRow3)

    return data
  },
  createLinesSumaryTotalArrayRow (rows) {
    const data = []
    let totallinhaNr = 0
    let totallinhaDC = 0

    for (const row in rows) {
        totallinhaNr += rows[row].totalPatients
        totallinhaDC += rows[row].cumunitaryClinic
    }
    const createRow1 = []
    createRow1.push({
                      colSpan: 2,
                      content: 'Total',
                      styles: { halign: 'right', fillColor: [204, 204, 204] }
                    })
    createRow1.push(totallinhaNr)
    createRow1.push(totallinhaDC)

    data.push(createRow1)

    return data
  },
  createMmiaDispenseTypeDSArrayRow (rows) {
    const data = []

    const createRow2 = []
    const createRow3 = []
    const createRow4 = []
    const createRow5 = []
    const createRow6 = []
    const createRow7 = []
    const createRow8 = []

    createRow2.push('Mês-5')
    createRow2.push(rows.dsM5)
    createRow3.push('Mês-4')
    createRow3.push(rows.dsM4)
    createRow4.push('Mês-3')
    createRow4.push(rows.dsM3)
    createRow5.push('Mês-2')
    createRow5.push(rows.dsM2)
    createRow6.push('Mês-1')
    createRow6.push(rows.dsM1)
    createRow7.push('No Mês')
    createRow7.push(rows.dsM0)
    createRow8.push('Total')
    createRow8.push(rows.dsM5 + rows.dsM4 + rows.dsM3 + rows.dsM2 + rows.dsM1 + rows.dsM0)

    data.push(createRow2)
    data.push(createRow3)
    data.push(createRow4)
    data.push(createRow5)
    data.push(createRow6)
    data.push(createRow7)
    data.push(createRow8)

    return data
  },
  createMmiaDispenseTypeDTArrayRow (rows) {
    const data = []

    const createRow5 = []
    const createRow6 = []
    const createRow7 = []
    const createRow8 = []

    createRow5.push(rows.dtM2)
    createRow6.push(rows.dtM1)
    createRow7.push(rows.dtM0)
    createRow8.push(rows.dtM2 + rows.dtM1 + rows.dtM0)

    data.push(createRow5)
    data.push(createRow6)
    data.push(createRow7)
    data.push(createRow8)

    return data
  },
  createMmiaDispenseTypeDMArrayRow (rows) {
    const data = []

    const createRow5 = []
    const createRow8 = []

    createRow5.push(rows.dM)
    createRow5.push(rows.dM + rows.dsM0 + rows.dtM0)
    createRow8.push(rows.dM)
    createRow8.push(rows.dM + rows.dtM2 + rows.dtM1 + rows.dtM0 + rows.dsM5 + rows.dsM4 + rows.dsM3 + rows.dsM2 + rows.dsM1 + rows.dsM0)

    data.push(createRow5)
    data.push(createRow8)

    return data
  },
  createMmiaAjustePercentageArrayRow (rows) {
    const data = []

    const createRow1 = []

    createRow1.push('Ajuste')
    createRow1.push(Math.round(((rows.dM + rows.dtM2 + rows.dtM1 + rows.dtM0 + rows.dsM5 + rows.dsM4 + rows.dsM3 + rows.dsM2 + rows.dsM1 + rows.dsM0) / (rows.dM + rows.dsM0 + rows.dtM0)) * 100) + '%')

    data.push(createRow1)

    return data
  },
  createFotterTableRow () {
    const data = []

    const createRow1 = []

    createRow1.push('Elaborado por')
    createRow1.push('Visto:')
    createRow1.push('Data de elaboração: ' + moment(new Date()).format('DD-MM-YYYY'))

    data.push(createRow1)

    return data
  }
}
