import os, json, base64, secrets
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from web3 import Web3
from cryptography.hazmat.primitives.asymmetric import x25519, ed25519
from cryptography.hazmat.primitives.kdf.scrypt import Scrypt
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305
from cryptography.hazmat.primitives import serialization
from dotenv import load_dotenv

load_dotenv()

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC_URL)) if RPC_URL else None
account = w3.eth.account.from_key(PRIVATE_KEY) if PRIVATE_KEY and w3 else None
# NOTE: update the path to ABI after compiling the contract (hardhat artifacts)
abi_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "AccessControl.json")
abi = None
try:
    with open(abi_path) as f:
        abi = json.load(f).get("abi")
except Exception:
    abi = None

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi) if w3 and CONTRACT_ADDRESS and abi else None

app = FastAPI()

# In-memory storage (for demo)
USERS = {}
MAILBOX = {}

# -------------------- Schemas --------------------
class RegisterUser(BaseModel):
    username: str
    passphrase: str

class LoginUser(BaseModel):
    username: str
    passphrase: str

class SendSecret(BaseModel):
    recipient: str
    secret: str
    service: str

# -------------------- Helpers --------------------
def derive_key(passphrase: str, salt: bytes):
    kdf = Scrypt(salt=salt, length=32, n=2**14, r=8, p=1)
    return kdf.derive(passphrase.encode())

def encrypt_secret(key: bytes, plaintext: bytes):
    nonce = secrets.token_bytes(12)
    aead = ChaCha20Poly1305(key)
    ct = aead.encrypt(nonce, plaintext, None)
    return base64.b64encode(nonce + ct).decode()

def decrypt_secret(key: bytes, data: str):
    raw = base64.b64decode(data)
    nonce, ct = raw[:12], raw[12:]
    aead = ChaCha20Poly1305(key)
    return aead.decrypt(nonce, ct, None).decode()

# -------------------- Routes --------------------
@app.post("/register")
def register_user(data: RegisterUser):
    if data.username in USERS:
        raise HTTPException(400, "User exists")
    salt = secrets.token_bytes(16)
    key = derive_key(data.passphrase, salt)
    x_priv = x25519.X25519PrivateKey.generate()
    ed_priv = ed25519.Ed25519PrivateKey.generate()
    USERS[data.username] = {
        "salt": base64.b64encode(salt).decode(),
        "x_priv": encrypt_secret(key, x_priv.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )),
        "ed_priv": encrypt_secret(key, ed_priv.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )),
    }
    MAILBOX[data.username] = []
    return {"msg": f"User {data.username} registered"}

@app.post("/send")
def send_secret(data: SendSecret):
    if data.recipient not in USERS:
        raise HTTPException(400, "Recipient not found")
    # For demo, encrypt secret randomly
    key = secrets.token_bytes(32)
    enc = encrypt_secret(key, data.secret.encode())
    MAILBOX[data.recipient].append({
        "from": "sender_demo",
        "service": data.service,
        "secret": enc
    })
    return {"msg": "Secret sent"}

@app.get("/inbox/{username}")
def get_inbox(username: str):
    if username not in MAILBOX:
        raise HTTPException(400, "User not found")
    inbox = MAILBOX[username]
    MAILBOX[username] = []
    return {"inbox": inbox}
