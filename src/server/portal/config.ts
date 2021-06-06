export namespace Server {
	export const port = Number(process.env.PORTAL_PORT || "8000")
	export const isDev = process.env.NODE_ENV === "development"
}