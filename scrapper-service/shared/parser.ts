import * as cheerio from "cheerio";
import {CheerioAPI} from "cheerio";
// @ts-ignore
import {Element} from "domhandler/lib/esm";

const typeMap: Record<string, string> = {
    "Лекція": "LECTURE",
    "Лабораторна": "LABORATORY",
    "Практичне": "PRACTICE"
}

type Teacher = {
    name: string,
    id: number | null
}

type Group = {
    name: string,
    id: number | null
}

type Room = {
    name: string
    id: number | null
}

type Pair = {
    subject: string
    type: string | null
    room: Room
    teachers: Teacher[]
    groups: Group[]
}

type Row = (Pair | null)[]

type Table = {
    title: string
    rows: Row[]
}

function getUrlId(url: string = ""): number | null {
    const regex = /[?&]id=(\d+)/;
    const match = url.match(regex);
    return match ? +match[1] : null;
}

function parseCell($: CheerioAPI, pair: cheerio.Cheerio<Element>): Pair {
    const activityTag = pair.find(".activity-tag")?.text().trim()
    const room = $(pair.find(".room "))?.find("a")

    const teachers: Teacher[] = []
    $(pair.find(".teacher"))?.find("a")?.each((_i, teacherNode) => {
        teachers.push({
            name: $(teacherNode).text().trim(),
            id: getUrlId($(teacherNode).attr("href"))
        });
    })

    const groups: Group[] = []
    $(pair.find(".flow-groups"))?.find("a")?.each((_i, groupNode) => {
        groups.push({
            name: $(groupNode).text().trim(),
            id: getUrlId($(groupNode).attr("href"))
        });
    })

    return {
        subject: pair.find(".subject")?.text().trim(),
        type: typeMap[activityTag],
        room: {
            name: room?.text().trim(),
            id: getUrlId(room?.attr("href"))
        },
        teachers,
        groups,
    }
}

export function parseRow($: CheerioAPI, row: cheerio.Cheerio<Element>): Row {
    const CELL_OFFSET = 1

    let rowData: Row = [];

    row
        .find("td")
        .slice(CELL_OFFSET)
        .each((_i, cell) => {
            const pair = $(cell).find(".pair")
            if (!pair || !$(pair).html()) {
                return void rowData.push(null)
            }

            const data = parseCell($, pair)
            rowData.push(data)
        });

    return rowData;
}

export function parseScheduleTables(html: string) {
    const $ = cheerio.load(html);

    const tables = $(".wrapper");

    let parsedData: Table[] = [];

    tables.each((_i, table) => {
        let rows: Row[] = [];

        $(table)
            .find("tbody tr")
            .each((_i, row) => {

                const data = parseRow($, $(row))
                rows.push(data);
            });

        parsedData.push({
            title: $(table).find("h2").text().trim(),
            rows
        });
    });

    return {
        tables: parsedData,
        meta: {}
    };
}

