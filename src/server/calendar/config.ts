export namespace Server {
	export const port = Number(process.env.CALENDAR_PORT || "8001")
	export const bodyLimit = "100kb"
	export const corsHeaders = ["Link"]
	export const isDev = process.env.NODE_ENV === "development"
}