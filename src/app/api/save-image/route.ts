import { pool } from "@/lib/db"; // adjust path if needed

export async function POST(req: Request) {
  if (!pool) {
    return new Response(
      JSON.stringify({ success: false, error: "Database not configured." }),
      { status: 500 }
    );
  }

  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "No image URL provided." }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO images (image_url) VALUES ($1) RETURNING *",
      [imageUrl]
    );

    return new Response(
      JSON.stringify({ success: true, image: result.rows[0] }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("DB insert error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
