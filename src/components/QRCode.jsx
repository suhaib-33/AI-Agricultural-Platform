import { QRCodeCanvas } from "qrcode.react";

function QRCode({ batchId }) {
  const verificationUrl = `${window.location.origin}/verify/${batchId}`;

  return (
    <div className="qr-box">
      <QRCodeCanvas value={verificationUrl} size={180} includeMargin />
      <p>Scan to verify</p>
      <small>Batch #{batchId}</small>
    </div>
  );
}

export default QRCode;