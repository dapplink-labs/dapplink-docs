# System Architecture

##

DappLink modular blockchain middleware technical solution is dedicated to simplifying the deployment and operation of Layer2 and Layer3 networks, providing developers with out-of-the-box foundational components, and promoting the development of chain abstraction technology; DappLink has already implemented technical solutions such as Rollup abstraction, cross-chain abstraction, L2 multi-staking protocol, proof system abstraction, fast verification network abstraction, and modular composable Layer3.

- Rollup Abstraction: Supports both transaction data and transaction proof Rollups. Any Layer2 and Layer3 can be integrated quickly; supports multi-DA Rollups such as AnyTrust, Celestia, EigenDA, EIP4844, and NearDA. Developers can choose the most suitable data availability solution based on different scenarios.

- Cross-chain Abstraction: Enables asset and message transfers between any chains; uses a decentralized Relayer network composed of MPC (multi-signature node) validators for verification, and adopts ZK-Proof for transaction validation.

- L2 Multi-staking Protocol: A secure staking model equivalent to BTC and ETH, allowing stakers to earn multiple layers of rewards.

- Proof System Abstraction: DappLink is exploring the implementation of both fraud proofs and validity proofs

    - Fraud Proof: Mainly used in OP Rollups. It assumes the sequencer is honest, but optimistically acknowledges the risk of malicious behavior. Fraud proofs are designed to prevent sequencers and related components from acting maliciously.

    - Validity Proof: Mainly used in ZK (zero-knowledge proof) Rollups. Each transaction is proven via a ZK proof generated off-chain and submitted on-chain for verification.

    - Currently, DappLink is building fraud proof abstractions based on OP and Arbitrum, and validity proof abstractions based on Scroll, ZkSync, Polygon, and Linea.

- Fast Verification Network Abstraction: A fast-finality verification network for Rollup state, reducing the waiting time for fraud proofs, enabling fast Layer1 asset exits; Layer2 blocks achieve quick finality, greatly improving the user experience of Dapps running on Layer2.

- Modular and Composable Layer3: Designs chain implementation models derived from upper-layer business requirements, enabling large-scale Web3 adoption. Currently supports Layer3 business chain modules in social, gaming, and custodial services.