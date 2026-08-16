import { serverApi } from "./src/shared/services/api/server-api";

async function main() {
  const caseId = "ea5da719-8b7a-4b2d-8ca7-66f38d9a60cb";
  const token = process.env.ADMIN_TOKEN;
  
  try {
    const res = await fetch(`http://localhost:8080/admin/cases/${caseId}/chatbot-config`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
}
main();
