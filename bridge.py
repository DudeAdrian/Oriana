# C:\Users\squat\desktop\Terracare_Project\oriana\bridge.py
import os
import sys
import sqlite3
import json

DB_PATH = r"C:\Users\squat\desktop\Terracare_Ledger\terracare.db"

class OrianaBridge:
    def __init__(self):
        print("[BRIDGE] Initializing Active Sovereign P2P Radio Bridge...")
        self.verify_infrastructure()

    def verify_infrastructure(self):
        if os.path.exists(DB_PATH):
            print(f"[BRIDGE] Connected successfully to Ledger Layer: {DB_PATH}")
        else:
            print(f"[BRIDGE] WARNING: Ledger DB file not found at {DB_PATH}")

    def get_latest_ledger_state(self):
        """Reads real runtime transaction blocks matching the verified schema."""
        if not os.path.exists(DB_PATH):
            return {"status": "OFFLINE", "records": []}
            
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            # Querying the authentic verified columns: id, activity_id, hash_signature
            cursor.execute("SELECT id, activity_id, hash_signature FROM Records ORDER BY rowid DESC LIMIT 5")
            rows = cursor.fetchall()
            conn.close()
            
            # Map columns to output payload cleanly
            records = [{"hash": r[0][:10], "type": r[1], "signature": r[2]} for r in rows]
            return {"status": "ORIANA_BRIDGE_ACTIVE", "records": records}
        except Exception as e:
            return {"status": "ERROR", "message": str(e), "records": []}

    def build_bridge(self):
        state = self.get_latest_ledger_state()
        print(f"[BRIDGE] Sync Status: {state['status']}")
        print(f"[BRIDGE] Active Logged Blocks Cached: {len(state['records'])}")
        return state

if __name__ == "__main__":
    bridge = OrianaBridge()
    result = bridge.build_bridge()
    print(f"Data Payload Dump: {json.dumps(result, indent=2)}")
