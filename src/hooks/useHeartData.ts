import { decode } from "@msgpack/msgpack";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useHeartData() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled");
  const [musicUrl, setMusicUrl] = useState("music/phepmau.mp3");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const query = new URLSearchParams(search);
    const d = query.get("d");
    const titleFromQuery = query.get("t");
    const musicFromQuery = query.get("m");
    const messagesFromQuery = query.get("me");
    let didUpdate = false;

    if (d) {
      try {
        // Base64 URL-safe decode
        const base64 = d.replace(/-/g, "+").replace(/_/g, "/");
        const binaryString = atob(base64);
        const uint8 = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          uint8[i] = binaryString.charCodeAt(i);
        }

        const data = decode(uint8) as string[];
        if (Array.isArray(data) && data.length >= 3) {
          const [t, me, m] = data;
          setTitle(t || "Untitled");
          setMusicUrl(m || "music/phepmau.mp3");
          const splitMessages = me ? me.split("|") : [];
          setMessages(splitMessages);

          localStorage.setItem("heart_title", t || "Untitled");
          localStorage.setItem("heart_music", m || "music/phepmau.mp3");
          localStorage.setItem("heart_messages", JSON.stringify(splitMessages));
          didUpdate = true;
        }
      } catch (e) {
        console.error("Failed to decode msgpack data", e);
      }
    }

    if (titleFromQuery) {
      setTitle(titleFromQuery);
      localStorage.setItem("heart_title", titleFromQuery);
      didUpdate = true;
    }

    if (musicFromQuery) {
      setMusicUrl(musicFromQuery);
      localStorage.setItem("heart_music", musicFromQuery);
      didUpdate = true;
    }

    if (messagesFromQuery) {
      const splitMessages = messagesFromQuery.split("|");
      setMessages(splitMessages);
      localStorage.setItem("heart_messages", JSON.stringify(splitMessages));
      didUpdate = true;
    }

    if (didUpdate) {
      navigate(pathname, { replace: true });
    } else {
      const savedTitle = localStorage.getItem("heart_title");
      const savedMusic = localStorage.getItem("heart_music");
      const savedMessages = localStorage.getItem("heart_messages");

      if (savedTitle) setTitle(savedTitle);
      if (savedMusic) setMusicUrl(savedMusic);
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    }
  }, [search, pathname, navigate]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return { musicUrl, messages };
}
