import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, passphrase }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      router.push("/dashboard");
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Passphrase" type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
