import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      preferredName,
      lastName,
      mobile,
      category,
      details,
      anonymous,
    } = body;

    if (!firstName || !lastName || !category || !details) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server environment variables");

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const displayName =
      preferredName?.trim() ||
      `${firstName.trim()} ${lastName.trim()}`;

    const description = details.trim();

    const shortDescription =
      description.length > 180
        ? `${description.slice(0, 177).trim()}...`
        : description;

    const { data, error } = await supabase
      .from("testimonies")
      .insert({
        name: displayName,
        phone: mobile?.trim() || null,

        workspace: "kharis",
        category,

        short_description: shortDescription,
        description,

        is_anonymous: anonymous === "Yes",

        // Submission must be reviewed before appearing publicly
        is_published: false,
        is_featured: false,
        is_featured_giving: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase testimony insert error:", error);

      return NextResponse.json(
        { error: "Unable to submit testimony." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Testimony API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}