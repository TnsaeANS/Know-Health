import { pool } from "@/lib/db";

export async function GET() {
  if (!pool) {
    return new Response(
      JSON.stringify({ success: false, error: "Database not configured." }),
      { status: 500 }
    );
  }

  try {
    const result = await pool.query(
      "SELECT * FROM images ORDER BY created_at DESC"
    );
    return new Response(
      JSON.stringify({ success: true, images: result.rows }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("DB fetch error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
