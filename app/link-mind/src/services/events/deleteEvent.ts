
type EventDeleteProps = {
    access_token: string,
    eventId: string
}

export default async function delete_Event({ access_token, eventId }: EventDeleteProps) {
    return {
        message: "test"
    }
}