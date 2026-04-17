import os
from activity_logger import log_event
import socket
def main():
    # Set up UDP socket listener on port 5000
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind(('0.0.0.0', 5000))
    
    while True:
        message, addr = sock.recvfrom(1024)
        # print(f'Verified Signal from {addr[0]}: {message}')
        print(f'Verified Signal from {iden.get_alias(addr[0])}: {message}')

if __name__ == '__main__':
    main()