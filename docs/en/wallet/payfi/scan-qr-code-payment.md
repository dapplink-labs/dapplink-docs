# QR Code + POS Terminal Payment
##

The phone displays a QR code, and the POS scans the code to obtain the "from" address and Bluetooth communication information. The POS terminal constructs a 32-byte MessageHash, which is transmitted to the app via Bluetooth for signing. After the app signs, it returns the signature to the POS terminal. The POS terminal then constructs the complete transaction and sends it to the blockchain.

- APP QR Code: contains the "from" address and key Bluetooth communication information.
- The POS scans to obtain the "from" address and Bluetooth communication information. The POS terminal constructs a 32-byte MessageHash, and after the app signs it, the signature is returned to the POS terminal. The POS then constructs the complete transaction and sends it to the blockchain.