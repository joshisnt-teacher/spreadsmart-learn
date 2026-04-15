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

    const supabaseUrl = Deno.env.get("SB_URL")!;
    const serviceRoleKey = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SB_ANON_KEY")!;

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
      return new Response(JSON.stringify({ error: "Only teachers can use this endpoint" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all classes owned by this teacher
    const { data: classes } = await adminClient
      .from("classes")
      .select("id")
      .eq("teacher_id", caller.id);

    const classIds = (classes || []).map((c: any) => c.id);

    // Get all students in those classes
    let studentUserIds: string[] = [];
    if (classIds.length > 0) {
      const { data: students } = await adminClient
        .from("class_students")
        .select("student_user_id")
        .in("class_id", classIds);
      studentUserIds = [...new Set((students || []).map((s: any) => s.student_user_id))];
    }

    // Delete all student data and auth accounts
    for (const studentId of studentUserIds) {
      await Promise.all([
        adminClient.from("class_students").delete().eq("student_user_id", studentId),
        adminClient.from("lesson_progress").delete().eq("user_id", studentId),
        adminClient.from("module_progress").delete().eq("user_id", studentId),
        adminClient.from("badges").delete().eq("user_id", studentId),
        adminClient.from("step_events").delete().eq("user_id", studentId),
        adminClient.from("profiles").delete().eq("user_id", studentId),
        adminClient.from("user_roles").delete().eq("user_id", studentId),
      ]);
      await adminClient.auth.admin.deleteUser(studentId);
    }

    // Delete teacher's own data
    await Promise.all([
      adminClient.from("assignments").delete().eq("teacher_id", caller.id),
      adminClient.from("step_events").delete().eq("user_id", caller.id),
      adminClient.from("lesson_progress").delete().eq("user_id", caller.id),
      adminClient.from("module_progress").delete().eq("user_id", caller.id),
      adminClient.from("badges").delete().eq("user_id", caller.id),
    ]);

    // Delete classes
    if (classIds.length > 0) {
      await adminClient.from("classes").delete().in("id", classIds);
    }

    await adminClient.from("profiles").delete().eq("user_id", caller.id);
    await adminClient.from("user_roles").delete().eq("user_id", caller.id);

    // Delete the teacher auth account
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(caller.id);
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
