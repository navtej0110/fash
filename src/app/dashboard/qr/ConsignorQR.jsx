"use client";
import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@heroui/button";
import Link from "next/link";

const ConsignorQR = ({ qrData, stripeResponse }) => {
  const qrRef = useRef(null);
  // Function to download QR Code as an image
  // const downloadQRCode = () => {
  //   const canvas = qrRef.current.querySelector("canvas");
  //   if (canvas) {
  //     const url = canvas.toDataURL("image/png");
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `${qrData.firstName}-QRCode.png`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };
  const downloadQRCode = () => {
    const originalCanvas = qrRef.current.querySelector("canvas");
    if (!originalCanvas) return;
  
    const originalSize = originalCanvas.width;
    const borderSize = 20; // pixels
    const newSize = originalSize + borderSize * 2;
  
    // Create a new canvas with extra white border
    const canvasWithBorder = document.createElement("canvas");
    canvasWithBorder.width = newSize;
    canvasWithBorder.height = newSize;
    const ctx = canvasWithBorder.getContext("2d");
  
    // Fill background with white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newSize, newSize);
  
    // Draw the original QR in the center
    ctx.drawImage(originalCanvas, borderSize, borderSize);
  
    // Trigger download
    const url = canvasWithBorder.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${qrData.firstName}-QRCode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col bg-white p-[100px] gap-10 mt-10 lg:w-[50%] h-[100%] items-center m-auto justify-center p-4 border rounded-lg shadow-md">
      {stripeResponse.status != 200 && (
        <>
        <p className="text-red-500 italic font-bold">*{stripeResponse.error}</p>
        <Link
        href="/dashboard/stripe-connect"
         className="success-btn"
      >
        Go to Stripe Connect
      </Link>
      </>
      )}
      {stripeResponse.status == 200 && (
        <>
          <div className="mt-4" ref={qrRef}>
            <QRCodeCanvas value={JSON.stringify(qrData)} size={110} />
          </div>
          <Button
            color="success"
            onPress={downloadQRCode}
            className="text-white py-6 px-6 rounded-lg text-lg mt-[20px]"
          >
            Download QR Code
          </Button>
        </>
      )}
    </div>
  );
};

export default ConsignorQR;
