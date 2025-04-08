# 二维码 + POS 机支付

在手机展示二维码，POS 扫码得 from 和蓝牙通信信息，POS 机里面构建 32 字节的 MessageHash, MessageHash  蓝牙通信传递给 APP 签名，APP 签名完成之后将 signature 返回给 POS 机，POS 构建完整的交易发送到链上
- APP 二维码：from 地址，蓝牙通信的关键信息
- POS 扫码得 from 和蓝牙通信信息，POS 机里面构建 32 字节的 MessageHash, APP 签名完成之后将 signature 返回给 POS 机，POS 构建完整的交易发送到链上