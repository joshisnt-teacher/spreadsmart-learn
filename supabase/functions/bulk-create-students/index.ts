import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "teacher")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Only teachers can create students" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { students, class_id } = await req.json();

    if (!class_id) {
      return new Response(JSON.stringify({ error: "Class ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(students) || students.length === 0 || students.length > 50) {
      return new Response(JSON.stringify({ error: "Provide 1-50 students" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify class belongs to teacher
    const { data: classData } = await adminClient
      .from("classes")
      .select("id")
      .eq("id", class_id)
      .eq("teacher_id", caller.id)
      .maybeSingle();

    if (!classData) {
      return new Response(JSON.stringify({ error: "Class not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: { username: string; success: boolean; error?: string }[] = [];

    for (const student of students) {
      const { username, pin } = student;

      // Validate
      if (!username || typeof username !== "string" || username.trim().length < 3 || username.trim().length > 30) {
        results.push({ username: username || "(empty)", success: false, error: "Username must be 3-30 characters" });
        continue;
      }
      if (!pin || typeof pin !== "string" || !/^\d{4,6}$/.test(pin)) {
        results.push({ username, success: false, error: "PIN must be 4-6 digits" });
        continue;
      }

      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
      const fakeEmail = `${cleanUsername}@student.excelpath.local`;

      // Check existing
      const { data: existing } = await adminClient
        .from("class_students")
        .select("id")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (existing) {
        results.push({ username: cleanUsername, success: false, error: "Username already taken" });
        continue;
      }

      // Create auth user
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: fakeEmail,
        password: pin,
        email_confirm: true,
        user_metadata: { display_name: cleanUsername, is_student: true },
      });

      if (createError) {
        results.push({ username: cleanUsername, success: false, error: createError.message });
        continue;
      }

      // Set role to student
      await adminClient
        .from("user_roles")
        .update({ role: "student" })
        .eq("user_id", newUser.user.id);

      // Enroll in class
      await adminClient
        .from("class_students")
        .insert({ class_id, student_user_id: newUser.user.id, username: cleanUsername });

      results.push({ username: cleanUsername, success: true });
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return new Response(
      JSON.stringify({ results, summary: { total: results.length, success: successCount, failed: failCount } }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
