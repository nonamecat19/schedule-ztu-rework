export namespace Schedule {
    export type Teacher = {
        name: string,
        id: number | null
    }

    export type Group = {
        name: string,
        id: number | null
    }

    export type Room = {
        name: string
        id: number | null
    }

    export type Pair = {
        subject: string
        type: string | null
        room: Room
        teachers: Teacher[]
        groups: Group[]
    }

    export type Row = (Pair | null)[]

    export type Table = {
        title: string
        rows: Row[]
    }

    export type ApiResponse = {
        tables: Table[],
        meta: {}
    }
}