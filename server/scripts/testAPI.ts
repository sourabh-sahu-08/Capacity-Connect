import axios from "axios";
const run = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:5000/api/auth/login", { email: "rahul@example.com", password: "password123" });
    const token = res.data.token;
    
    console.log("Fetching overview...");
    const mgr = await axios.get("http://127.0.0.1:5000/api/v1/manager/overview", { headers: { Authorization: `Bearer ${token}` } });
    console.log("OVERVIEW:", mgr.data);

    console.log("Fetching queue...");
    const q = await axios.get("http://127.0.0.1:5000/api/v1/manager/attention-queue", { headers: { Authorization: `Bearer ${token}` } });
    console.log("QUEUE:", q.data);
  } catch (err: any) {
    console.error("ERROR:", err.response?.data || err.message);
  }
}
run();
