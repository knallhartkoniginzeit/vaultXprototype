import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, passphrase }),
    });
    const data = await res.json();
    setMsg(data.msg || JSON.stringify(data));
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Passphrase" type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>{msg}</p>
    </div>
  );
}
