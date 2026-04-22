import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, exerciseName, metrics, patientWeek } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `You are an expert AI physical therapist specializing in ACL rehabilitation. 
The patient just completed ${exerciseName || "a rehab exercise"}.
Their session metrics: hip flexion ${metrics?.hip || 44}°, symmetry ${metrics?.sym || 87}%, reps completed ${metrics?.reps || 15}.
They are on week ${patientWeek || 3} of their ACL recovery program.
Respond in 2-3 concise sentences. Be encouraging but clinically specific. 
Never recommend stopping rehab or seeing a doctor unless truly urgent.`,
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return Response.json({ error: data.error?.message || "Claude API error" }, { status: 500 });
    }

    const reply = data.content?.[0]?.text || "Keep up the great work with your recovery!";
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});