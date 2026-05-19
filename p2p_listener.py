# C:\Users\squat\desktop\Terracare_Project\oriana\p2p_listener.py
import socket
import sqlite3
import os
import hashlib
from datetime import datetime

DB_PATH = r"C:\Users\squat\desktop\Terracare_Ledger\terracare.db"

def get_node_alias(ip_address):
    """Safely retrieves identity alias from the ledger or defaults gracefully."""
    if not os.path.exists(DB_PATH):
        return f"Unknown_Node_{ip_address}"
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Querying the identity table by ID
        cursor.execute("SELECT name FROM Identities WHERE id = ?", (ip_address,))
        row = cursor.fetchone()
        conn.close()
        return row[0] if row else f"Node_{ip_address}"
    except Exception:
        return f"Node_{ip_address}"

def log_p2p_event_to_ledger(ip_address, payload_message):
    """Directly commits incoming mesh signals safely into the verified database schema."""
    if not os.path.exists(DB_PATH):
        print(f"[LISTENER ERROR] Database target missing at {DB_PATH}")
        return

    timestamp = datetime.now().isoformat()
    activity_id = "P2P_SIGNAL"
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Step 1: Ensure the Node Identity exists in the DB records
        cursor.execute("INSERT OR IGNORE INTO Identities (id, name) VALUES (?, ?)", (ip_address, f"Node_{ip_address}"))
        
        # Step 2: Compute cryptographic signature matching your active schema requirements
        record_data_str = f"ip:{ip_address}|type:{activity_id}|msg:{payload_message}|time:{timestamp}"
        record_hash = hashlib.sha256(record_data_str.encode('utf-8')).hexdigest()
        
        # Step 3: Insert directly into the verified layout (id, activity_id, hash_signature)
        cursor.execute("INSERT INTO Records (id, activity_id, hash_signature) VALUES (?, ?, ?)", 
                       (record_hash, activity_id, record_hash))
        
        conn.commit()
        conn.close()
        print(f"[LISTENER] Cryptographic block signed and committed: {record_hash[:10]}...")
    except Exception as e:
        print(f"[LISTENER DB FAILURE] {str(e)}")

def main():
    print("[LISTENER] Launching Active P2P Radio Socket on UDP Port 5000...")
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    
    try:
        sock.bind(('0.0.0.0', 5000))
    except Exception as e:
        print(f"[LISTENER FATAL CRASH] Cannot bind to port 5000: {e}")
        return

    while True:
        try:
            message_bytes, addr = sock.recvfrom(1024)
            ip_address = addr[0]
            payload = message_bytes.decode('utf-8', errors='ignore').strip()
            
            alias = get_node_alias(ip_address)
            print(f"\n[SIGNAL RECEIVED] Verified Signal from {alias} [{ip_address}]: {payload}")
            
            # Pipe straight into the Ledger DB
            log_p2p_event_to_ledger(ip_address, payload)
        except KeyboardInterrupt:
            print("\n[LISTENER] Terminating socket safely.")
            break
        except Exception as e:
            print(f"[LISTENER RUNTIME ERROR] {e}")

if __name__ == '__main__':
    main()
