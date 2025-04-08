# 批量地址生成

![img.png](../images/centralized-wallet-4.png)

- 业务调度自己的签名生成密钥，私钥不会离开 TEE 或者 CloudHSM, 但是它会将公钥列表返回到业务方
- 业务方把公钥列表给到 multichain，multichain 调度 wallet-chain-account/utxo 根据公钥导出地址
- 把生成地址列表存到业务表里面，并且返回地址列表