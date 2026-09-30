// Test REST connection to Supabase
const url = "https://qganxnylnwuoxzlclehb.supabase.co/rest/v1/";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnYW54bnlsbnd1b3h6bGNsZWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NTg5ODIsImV4cCI6MjEwNjMzNDk4Mn0.u1bfHtQSVZZrUBWjYSKFZKfveNt_R-3MXuSPKOIHj_0";

async function testRest() {
  try {
    const res = await fetch(`${url}vehicles?select=*&limit=1`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      }
    });

    const body = await res.text();
    console.log("Supabase REST status:", res.status);
    console.log("Supabase REST response:", body);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testRest();
