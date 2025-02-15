import puppeteer from "puppeteer";
import {readCache, setCache} from "./cache";

const SCHEDULE_URL = "https://rozklad.ztu.edu.ua/schedule"

export async function getGroupSchedule(groupId: string) {
    const cacheKey = `schedule-group:${groupId}` as const

    const cachedValue = await readCache(cacheKey)

    if (cachedValue) {
        return cachedValue
    }

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(`${SCHEDULE_URL}/users/login`);

    await page.type('#login', process.env.ACCOUNT_NAME!);
    await page.type('#password', process.env.ACCOUNT_PASS!);

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    await page.goto(`${SCHEDULE_URL}/group?id=${groupId}`);

    const pageContent = await page.content();

    await browser.close();

    void setCache(cacheKey, pageContent);

    return pageContent;
}