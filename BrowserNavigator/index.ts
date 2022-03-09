import { Browser, Page } from "puppeteer";
import puppeteer from 'puppeteer';
import { IBrowserNavigator } from "../types";
const chromeLauncher = require("chrome-launcher/dist/chrome-launcher");
const util = require('util');
const request = require('request');

export default class BrowserNavigator {

    public browser: Browser;
    public activePage: Page;


    constructor(browser: Browser, page: Page) {
        this.browser = browser;
        this.activePage = page;
    }

    public static async init(starterURL?: string): Promise<IBrowserNavigator | undefined> {
        try {
            console.log("Launching Anmeldung Appointment Finder...");
            let chrome = await chromeLauncher.launch({
                userDataDir: false,
                // chromeFlags: ['--headless']
            })
            const resp = await util.promisify(request)(`http://localhost:${chrome.port}/json/version`);
            const { webSocketDebuggerUrl } = JSON.parse(resp.body);
            const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl, defaultViewport: null });
            const page = await browser.newPage();
            if (starterURL) {
                await page.goto(starterURL);
            }
            return new BrowserNavigator(browser, page);
        } catch (e) {
            console.error(e);
        }
    }

    public async navigateToURL(url: string): Promise<void> {
        try {
            await this.activePage?.goto(url);
        } catch (e) {
            console.error(e);
        }
    }

    public async selectAppointmentLocations() {
        await this.navigateToURL('https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&anliegen[]=120686&dienstleisterlist=122210,122217,327316,122219,327312,122227,327314,122231,327346,122243,327348,122252,329742,122260,329745,122262,329748,122254,329751,122271,327278,122273,327274,122277,327276,330436,122280,327294,122282,327290,122284,327292,327539,122291,327270,122285,327266,122286,327264,122296,327268,150230,329760,122301,327282,122297,327286,122294,327284,122312,329763,122314,329775,122304,327330,122311,327334,122309,327332,122281,327352,122279,329772,122276,327324,122274,327326,122267,329766,122246,327318,122251,327320,122257,327322,122208,327298,122226,327300&herkunft=http%3A%2F%2Fservice.berlin.de%2Fdienstleistung%2F120686%2F')
    }

    public async isAppointmentAvailable() {
        console.clear()
        console.log('Checking for available appointments...')
        let apptAvailable = await this.activePage.evaluate(() => {
            let calendar = document.querySelector('.calendar-table');
            let days = calendar?.querySelectorAll('td');
            if (!days) {
                return false;
            }
            for (let i = 0; i < days?.length; i++) {
                if (days[i].getAttribute('class') === "buchbar") {
                    return true;
                }
            }
            return false;
        })
        return apptAvailable
    }

    public async close() {
        try {
            await this.browser.close();
        } catch (e) {
            console.error(e);
        }
    }

    public async disconnect(): Promise<void> {
        await this.browser.disconnect()
    }
}