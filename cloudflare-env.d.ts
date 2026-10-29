declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_PIN?: string;
    ADMIN_SESSION_TOKEN?: string;
    GOOGLE_SHEETS_WEBHOOK_URL?: string;
    GOOGLE_SHEETS_SYNC_SECRET?: string;
  }
}
