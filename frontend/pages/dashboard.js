import { useState, useEffect } from "react";

export default function Dashboard() {
  const [recipient, setRecipient] = useState("");
  const [secret, setSecret] = useState("");
  const [service, setService] = useState("");
  const [inbox, setInbox] = useState([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

  const sendSecret = async () => {
    const res = await fetch("http://localhost:8000/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, secret, service }),
    });
    const data = await res.json();
    alert(data.msg || JSON.stringify(data));
  };

  const fetchInbox = async () => {
    const res = await fetch(`http://localhost:8000/inbox/${username}`);
    const data = await res.json();
    setInbox(data.inbox || []);
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  return (
    <div>
      <h2>Dashboard ({username})</h2>

      <h3>Send Password</h3>
      <input placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input placeholder="Password" value={secret} onChange={(e) => setSecret(e.target.value)} />
      <input placeholder="Service" value={service} onChange={(e) => setService(e.target.value)} />
      <button onClick={sendSecret}>Send</button>

      <h3>Inbox</h3>
      <button onClick={fetchInbox}>Refresh Inbox</button>
      <ul>
        {inbox.map((msg, idx) => (
          <li key={idx}>
            From: {msg.from}, Service: {msg.service}, Secret: [hidden]
          </li>
        ))}
      </ul>
    </div>
  );
}
