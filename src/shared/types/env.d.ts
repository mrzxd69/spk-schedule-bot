declare module "bun" {
	interface Env {
		TELEGRAM_BOT_TOKEN: string;
		APP_ID: string;
		APP_HASH: string;
		READ_DATABASE: string;
		WRITE_DATABASE: string;
		BACKUP_CHANNEL: number;
		MAIN_CHANNEL: number;
	}
}
