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
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

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

    // Verify teacher role
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "teacher")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Only teachers can delete students" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { student_user_id, class_id } = await req.json();

    if (!student_user_id || !class_id) {
      return new Response(JSON.stringify({ error: "student_user_id and class_id are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify class belongs to this teacher
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

    // Verify student is in this class
    const { data: enrollment } = await adminClient
      .from("class_students")
      .select("id")
      .eq("class_id", class_id)
      .eq("student_user_id", student_user_id)
      .maybeSingle();

    if (!enrollment) {
      return new Response(JSON.stringify({ error: "Student not found in this class" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete related data
    await Promise.all([
      adminClient.from("class_students").delete().eq("student_user_id", student_user_id),
      adminClient.from("lesson_progress").delete().eq("user_id", student_user_id),
      adminClient.from("module_progress").delete().eq("user_id", student_user_id),
      adminClient.from("badges").delete().eq("user_id", student_user_id),
      adminClient.from("profiles").delete().eq("user_id", student_user_id),
      adminClient.from("user_roles").delete().eq("user_id", student_user_id),
    ]);

    // Delete the auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(student_user_id);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
