import {getGroupSchedule} from "@/lib/api";

interface GroupPageProps {
    params: {
        groupId: string;
    }
}

export default async function GroupPage({params}: GroupPageProps) {
    const {groupId} = await params;
    console.log({groupId});

    const {tables} = await getGroupSchedule(+groupId)

    return (
        <div>
            {
                tables?.map(({title, rows}, index) => (
                    <pre className="p-10" key={index}>
                        <h2>
                            {title}
                        </h2>
                        <div className="flex flex-col gap-2">
                            {rows.map((row, index) => (
                                <div className="bg-blue-950 p-2 flex gap-2" key={index}>
                                    {row.map((cell, index) => (
                                        <div key={index} className="bg-red-950">
                                            {JSON.stringify(cell, null, 2)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </pre>
                ))
            }
        </div>
    )
}