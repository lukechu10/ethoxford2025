from web3 import Web3
import requests
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ✅ Connect to Binance Smart Chain (Optimized RPC)
BSC_NODE_URL = "https://rpc.ankr.com/bsc"  # Use a faster RPC provider
w3 = Web3(Web3.HTTPProvider(BSC_NODE_URL))

# ✅ Contract details
CONTRACT_ADDRESS = "0xf4DCED26379A3C9D8a636099140a98e90A15Be52"
ABI = [
    {
        "inputs": [],
        "name": "getAllPapers",
        "outputs": [
            {
                "components": [
                    {"internalType": "uint256", "name": "id", "type": "uint256"},
                    {"internalType": "address", "name": "author", "type": "address"},
                    {"internalType": "string", "name": "title", "type": "string"},
                    {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
                    {"internalType": "int64", "name": "votes", "type": "int64"},
                    {"internalType": "uint256[]", "name": "reviews", "type": "uint256[]"}
                ],
                "internalType": "struct DeSci.Paper[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_paperId", "type": "uint256"}],
        "name": "getPaperVotes",
        "outputs": [{"internalType": "int64", "name": "", "type": "int64"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
        "name": "getReputation",
        "outputs": [{"internalType": "int256", "name": "", "type": "int256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "_reviewId", "type": "uint256"}],
        "name": "getReviewVotes",
        "outputs": [{"internalType": "int64", "name": "", "type": "int64"}],
        "stateMutability": "view",
        "type": "function"
    },
    {"inputs": [], "name": "paperCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "papers",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "address", "name": "author", "type": "address"},
            {"internalType": "string", "name": "title", "type": "string"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
            {"internalType": "int64", "name": "votes", "type": "int64"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "reputation",
        "outputs": [{"internalType": "int64", "name": "", "type": "int64"}],
        "stateMutability": "view",
        "type": "function"
    },
    {"inputs": [], "name": "reviewCount", "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}], "stateMutability": "view", "type": "function"},
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "reviews",
        "outputs": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "uint256", "name": "paperId", "type": "uint256"},
            {"internalType": "address", "name": "reviewer", "type": "address"},
            {"internalType": "string", "name": "comment", "type": "string"},
            {"internalType": "int64", "name": "votes", "type": "int64"}
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "string", "name": "_title", "type": "string"}],
        "name": "submitPaper",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_paperId", "type": "uint256"},
            {"internalType": "string", "name": "_comment", "type": "string"}
        ],
        "name": "submitReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_paperId", "type": "uint256"},
            {"internalType": "bool", "name": "_upvote", "type": "bool"}
        ],
        "name": "votePaper",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "uint256", "name": "_reviewId", "type": "uint256"},
            {"internalType": "bool", "name": "_upvote", "type": "bool"}
        ],
        "name": "voteReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": False,
        "inputs": [
            { "indexed": True, "internalType": "uint256", "name": "paperId", "type": "uint256" },
            { "indexed": True, "internalType": "address", "name": "author", "type": "address" },
            { "indexed": False, "internalType": "string", "name": "title", "type": "string" }
        ],
        "name": "PaperSubmitted",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            { "indexed": True, "internalType": "uint256", "name": "reviewId", "type": "uint256" },
            { "indexed": True, "internalType": "uint256", "name": "paperId", "type": "uint256" },
            { "indexed": True, "internalType": "address", "name": "reviewer", "type": "address" }
        ],
        "name": "ReviewSubmitted",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            { "indexed": True, "internalType": "address", "name": "user", "type": "address" },
            { "indexed": False, "internalType": "int64", "name": "newReputation", "type": "int64" }
        ],
        "name": "ReputationAdjusted",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            { "indexed": True, "internalType": "uint256", "name": "reviewId", "type": "uint256" },
            { "indexed": True, "internalType": "address", "name": "reviewer", "type": "address" }
        ],
        "name": "ReviewFlagged",
        "type": "event"
    }
] # Replace with actual ABI

# ✅ Load the smart contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

# ✅ Wallet details (DO NOT hardcode private keys)
WALLET_ADDRESS = "0xf845E76d6Cbc05b091bA19c4014443c529C866b6"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")  # Load securely from .env file

# ✅ AI Moderation API URL
MODERATION_API_URL = "http://localhost:5000/moderate_comment"

# ✅ Store the last processed block
LAST_PROCESSED_BLOCK = w3.eth.block_number - 3  # Start 3 blocks behind to catch events

# ✅ Helper function to sign and send transactions
def send_transaction(tx):
    """Signs and sends a transaction to the blockchain."""
    tx["nonce"] = w3.eth.getTransactionCount(WALLET_ADDRESS)
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return w3.toHex(tx_hash)

# ✅ Monitor blockchain events (Fixed for "Method Disabled")
def monitor_events():
    """Monitors events emitted by the smart contract & triggers AI moderation."""
    global LAST_PROCESSED_BLOCK
    print("🔍 Listening for ReputationAdjusted events...")

    while True:
        try:
            latest_block = w3.eth.block_number

            # ✅ Fetch logs since the last processed block
            logs = w3.eth.get_logs({
                "fromBlock": max(0, LAST_PROCESSED_BLOCK),
                "toBlock": latest_block,
                "address": CONTRACT_ADDRESS,
                "topics": ["0x" + w3.keccak(text="ReputationAdjusted(address,int64)").hex()]
            })

            # ✅ Process each new event
            for log in logs:
                process_event(log)

            # ✅ Update last processed block
            LAST_PROCESSED_BLOCK = latest_block

        except Exception as e:
            print(f"❌ Error monitoring events: {e}")

        time.sleep(10)  # ✅ Reduce polling frequency to avoid rate limits

# ✅ Process ReputationAdjusted Events
def process_event(log):
    """Processes a detected ReputationAdjusted event."""
    try:
        event_data = contract.events.ReputationAdjusted().process_log(log)
        user = event_data["args"]["user"]
        new_reputation = event_data["args"]["newReputation"]
        print(f"📢 Reputation Updated: {user} -> {new_reputation}")

        # ✅ AI Moderation for negative reputation
        if new_reputation < 0:
            moderate_comment(user)

    except Exception as e:
        print(f"❌ Error processing event: {e}")

# ✅ Call AI Moderation API
def moderate_comment(user):
    """Sends a sample comment to AI Moderation API for toxicity check."""
    comment = "This research is garbage"  # Replace with actual comment source

    try:
        response = requests.post(MODERATION_API_URL, json={"comment": comment})
        result = response.json()

        if result.get("is_toxic"):
            print(f"⚠️ Toxic comment detected for user {user}")

            # ✅ Penalize the user further
            tx = contract.functions.flagReview(user).buildTransaction({
                "chainId": 56,  # Binance Smart Chain
                "gas": 200000,
                "gasPrice": w3.toWei("5", "gwei"),
                "nonce": w3.eth.getTransactionCount(WALLET_ADDRESS),
            })
            tx_hash = send_transaction(tx)
            print(f"✅ Transaction sent: {tx_hash}")

    except Exception as e:
        print(f"❌ Error calling AI Moderation API: {e}")

# ✅ Entry point
if __name__ == "__main__":
    monitor_events()
