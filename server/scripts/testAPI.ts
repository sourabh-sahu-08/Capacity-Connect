import axios from "axios";
const run = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:5000/api/auth/register", { name: "Test Learner 3", email: "learner3@example.com", password: "password123", role: "LEARNER" });
    const token = res.data.token;
    
    console.log("Fetching profile...");
    const profileRes = await axios.get("http://127.0.0.1:5000/api/v1/competency/profile", { headers: { Authorization: `Bearer ${token}` } });
    console.log("PROFILE:", profileRes.data);

    console.log("Fetching analyze...");
    const analyzeRes = await axios.post("http://127.0.0.1:5000/api/v1/competency/analyze", {}, { headers: { Authorization: `Bearer ${token}` } });
    console.log("ANALYZE:", analyzeRes.data);
  } catch (err: any) {
    console.error("ERROR:", err.response?.data || err.message);
  }
}
run();
