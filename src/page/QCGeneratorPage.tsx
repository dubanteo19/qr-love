import { Button } from "@/components/ui/button";
import { QRPreview } from "@/components/ui/QRPreview";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { encode } from "@msgpack/msgpack";
import { X } from "lucide-react";
export const QCGeneratorPage = () => {
  const [title, setTitle] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([
    "Anh nhớ em",
    "Em là cả thế giới của anh",
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [music, setMusic] = useState<string>("music/phepmau.mp3");
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const audioOptions = [
    { label: "Phép Màu", value: "music/phepmau.mp3" },
    { label: "Ánh Nắng Của Anh", value: "music/anhnangcuaanh.mp3" },
    { label: "Hơn Cả Yêu", value: "music/honcayeu.mp3" },
    { label: "Nơi Này Có Anh", value: "music/noinaycoanh.mp3" },
    { label: "Sau Tất Cả", value: "music/sautatca.mp3" },
    { label: "Em Gái Mưa", value: "music/emgaimua.mp3" },
    { label: "Anh sai rồi", value: "music/anhsairoi.mp3" },
    { label: "Về bên anh", value: "music/vebenanh.mp3" },
    { label: "Tháng Tư Là Lời Nói Dối Của Em", value: "music/thangtu.mp3" },
    { label: "Phút ban đầu", value: "music/phutbandau.mp3" },
  ];
  const handleGenerate = () => {
    const dataArray = [
      title || "",
      messages.join("|"),
      music || ""
    ];
    const uint8 = encode(dataArray);
    const base64 = btoa(String.fromCharCode(...uint8))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const url = `${window.location.origin}/love?d=${base64}`;
    setGeneratedUrl(url);
  };

  const addMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, currentMessage.trim()]);
      setCurrentMessage("");
    }
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e .key === "Backspace") {
      e.preventDefault();
      removeMessage(messages.length - 1);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      addMessage();
    }
  };
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(music);
    audioRef.current.onended = () => setIsPlaying(false);
  }, [music]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-4 md:space-y-6">
        <h2 className="text-3xl font-bold text-center text-pink-600">
          🎁 Thay lời muốn nói
        </h2>
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">💌 Tiêu đề</label>
          <input
            type="text"
            value={title}
            maxLength={100}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="Ví dụ: I love you"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">📝 Lời nhắn</label>
          <p className=" text-pink-500">Nhấn Enter để thêm lời nhắn</p>
          
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[140px] focus-within:ring-2 focus-within:ring-pink-300 transition bg-white">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 h-[30px] rounded-full text-sm font-medium animate-in fade-in zoom-in duration-200"
              >
                <span>{msg}</span>
                <button 
                  onClick={() => removeMessage(index)}
                  className="hover:bg-pink-200 rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={currentMessage}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={messages.length === 0 ? "Nhập lời nhắn của bạn..." : ""}
              className="flex-1 outline-none min-w-[150px] p-1 text-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-gray-700 font-medium">🎵 Chọn nhạc</label>
          <div className="flex gap-2 items-center">
            <select
              value={music}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setMusic(e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            >
              {audioOptions.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button
              onClick={togglePlay}
              variant={"ghost"}
              className="text-2xl  rounded transition cursor-pointer px-1"
            >
              {isPlaying ? "⏸️" : "▶️"}
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Button
            disabled={!title || messages.length === 0}
            onClick={handleGenerate}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            📦 Generate QR
          </Button>
        </div>

        {generatedUrl && (
          <div className="mt-10 p-6 bg-gray-50  border border-pink-200 rounded-xl shadow-inner text-center space-y-4">
            <p className="text-lg font-semibold text-gray-700">
              📲 Scan or share:
            </p>
            <QRPreview value={generatedUrl} />
          </div>
        )}
      </div>
    </div>
  );
};
