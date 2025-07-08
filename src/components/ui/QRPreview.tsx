import { QRCodeCanvas } from "qrcode.react";
import { useRef, useState } from "react";
import domtoimage from "dom-to-image-more";
import { Button } from "./button";
export const QRPreview = ({ value }: { value: string }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#ec4899"); // pink
  const getGradient = (hex: string) =>
    `linear-gradient(135deg, ${hex}33 0%, ${hex}05 100%)`;
  const handleDownload = async () => {
    if (!frameRef.current) return;
    const originalStyle = frameRef.current.style.padding;
    try {
      frameRef.current.style.padding = "3rem";
      const dataUrl = await domtoimage.toPng(frameRef.current);
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      frameRef.current.style.padding = originalStyle;
    }
  };

  return (
    <div className="text-center space-y-4 flex-col flex items-center">
      <div className="flex flex-col justify-center items-center">
        <label>Chọn màu nè</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 rounded-full border"
        />
      </div>

      <div
        ref={frameRef}
        style={{ padding: "2rem", backgroundColor: "#fff" }} // extra padding
        className="inline-block"
      >
        <div
          style={{
            background: getGradient(color),
            borderColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
            padding: "1.5rem",
            paddingTop: "2rem",
          }}
          className="rounded-3xl relative border-4 border-dashed"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl">
            🎀
          </div>

          <QRCodeCanvas
            value={value}
            size={200}
            bgColor="#ffffff"
            fgColor={color}
            level="H"
          />
          <div className="mt-2 text-sm text-pink-800 font-medium">
            💖 Quét ở đây nè 💖
          </div>
        </div>
      </div>

      <Button
        onClick={handleDownload}
        className="bg-pink-500 hover:bg-pink-600 text-white  shadow"
      >
        Tải xuống QR nè
      </Button>
    </div>
  );
};
