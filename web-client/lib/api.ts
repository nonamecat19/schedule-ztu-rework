import axios from 'axios';
import {Schedule} from "@/types";

const scrapperApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SCRAPPER_URL,
})

export async function getGroupSchedule(groupId: number) {
    const {data} = await scrapperApi<Schedule.ApiResponse>(`/schedule/${groupId}`)
    return data
}