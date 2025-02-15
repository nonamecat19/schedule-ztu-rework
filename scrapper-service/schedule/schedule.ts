import {api} from "encore.dev/api";

import {getGroupSchedule} from "../shared/scrapper";
import {parseScheduleTables, Table} from "../shared/parser";

interface GetGroupScheduleResponse {
    tables: Table[]
    meta: {}
}

export const get = api(
    {expose: true, method: "GET", path: "/schedule/:groupId"},
    async ({groupId}: { groupId: string }): Promise<GetGroupScheduleResponse> => {

        const content = await getGroupSchedule(groupId)

        const parsedSchedule = parseScheduleTables(content)
        console.log(parsedSchedule)

        return parsedSchedule;
    }
);

// Next steps
//
// 1. Deploy your application to the cloud
//
//     git add -A .
//     git commit -m 'Commit message'
//     git push encore
//
// 2. To continue exploring Encore, check out these topics in docs:
//
//    Building a REST API:   https://encore.dev/docs/ts/tutorials/rest-api
//    Creating Services:      https://encore.dev/docs/ts/primitives/services
//    Creating APIs:         https://encore.dev/docs/ts/primitives/defining-apis
//    Using SQL Databases:        https://encore.dev/docs/ts/primitives/databases
//    Using Pub/Sub:         https://encore.dev/docs/ts/primitives/pubsub
//    Authenticating users:  https://encore.dev/docs/ts/develop/auth
//    Using Cron Jobs: https://encore.dev/docs/ts/primitives/cron-jobs
//    Using Secrets: https://encore.dev/docs/ts/primitives/secrets
