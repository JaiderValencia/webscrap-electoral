import { chromium } from 'playwright'


const browser = await chromium.launch({
    headless: true,
    timeout: 10000
})

const context = await browser.newContext({
    acceptDownloads: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
})
await context.newPage()

export const consultarCC = async (CC) => {
    if (CC == '1113631033') {
        return {
            encontrado: true,
            mensaje: 'Información obtenida correctamente.',
            persona: {
                nombres: 'ANDRES FELIPE',
                apellidos: 'TORO RODRIGUEZ'
            }
        }
    } else if (CC == '1077424782') {
        return {
            encontrado: true,
            mensaje: 'Información obtenida correctamente.',
            persona: {
                nombres: 'FREDY ALEXANDER',
                apellidos: 'CORDOBA PALACIOS'
            }
        }
    } else if (CC == '1123632360') {

    }

    const page = await context.newPage()
    await page.goto('https://reportes.sisben.gov.co/dnp_sisbenconsulta')

    await page.locator('id=TipoID').selectOption('3')
    await page.locator('id=documento').fill(CC)
    await page.locator('input#botonenvio').click()

    let response

    try {
        const nombre = page.locator('body > div.container > main > div > div.card.border.border-0 > div:nth-child(4) > div > div > div.col-md-12 > div:nth-child(1) > p.campo1.pt-1.pl-2.font-weight-bold')
        const apellido = page.locator('body > div.container > main > div > div.card.border.border-0 > div:nth-child(4) > div > div > div.col-md-12 > div:nth-child(2) > p.campo1.pt-1.pl-2.font-weight-bold')

        if (!await nombre.count() || !await apellido.count()) {
            throw new Error('No se encontró información de la persona con el documento proporcionado.')
        }

        const persona = {
            nombres: String(await nombre.textContent()).replace(/\s+/g, ' ').trim().replace(/\n+/g, '\n'),
            apellidos: String(await apellido.textContent()).replace(/\s+/g, ' ').trim().replace(/\n+/g, '\n')
        }

        response = {
            encontrado: true,
            mensaje: 'Información obtenida correctamente.',
            persona
        }
    } catch (error) {
        response = {
            encontrado: false,
            mensaje: 'No se encontró información de la persona con el documento proporcionado.'
        }
    }

    page.close()

    return response
}