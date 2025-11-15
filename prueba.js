import { chromium } from 'playwright'


const browser = await chromium.launch({
    headless: false,
    timeout: 10000,
})

const context = await browser.newContext({
    acceptDownloads: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
})
const page = await context.newPage()
await page.goto('https://web.satena.com/booking/widget?carrier=9r&lang=es')

await page.locator('#searchflight > div > div > div > form > div.searchForm__flightType > div > label:nth-child(1)').click()

await page.locator('#origin > div > input').click()

const optionsFrom = await page.locator('#originDropdownContainer > ul > li').all()

const opcionFrom = 'quibdo'

for (const option of optionsFrom) {
    const text = await option.locator('div.autocompleteAirport__suggestCity > span').textContent()

    if (text.toLowerCase().includes(opcionFrom)) {
        option.click()
        break
    }
}

await page.locator('#destination > div > input').click()
const optionsTo = await page.locator('#destinationDropdownContainer > ul > li').all()

const opcionTo = 'medellin'

for (const option of optionsTo) {
    const text = await option.locator('div.autocompleteAirport__suggestCity > span').textContent()
    
    if (text.toLowerCase().includes(opcionTo)) {
        option.click()
        break
    }
}

