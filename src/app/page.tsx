"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

interface AppSettings {
  app_store_url: string;
  play_store_url: string;
}

function HomeContent() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("https://litmxvmpeyyyvwjdrncd.supabase.co/storage/v1/object/public/app/settings.json")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error(err));
  }, []);

  const handleOpenGrand = () => {
    const queryString = searchParams.toString();
    const deepLinkPath = pathname === "/" ? "home" : pathname.startsWith("/") ? pathname.substring(1) : pathname;
    const finalDeepLink = `grand://${deepLinkPath}${queryString ? "?" + queryString : ""}`;

    const userAgent = navigator.userAgent || navigator.vendor;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const storeUrl = isIOS ? settings?.app_store_url : isAndroid ? settings?.play_store_url : null;

    const timer = setTimeout(() => {
      if (document.hasFocus() && storeUrl) {
        window.location.replace(storeUrl);
      }
    }, 2500);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = finalDeepLink;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 500);

    window.onblur = () => clearTimeout(timer);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image src="/icon.png" alt="Grand App" width={100} height={100} priority />
        <div className={styles.intro}>
          <h1>Welcome to Grand</h1>
          <p>Trade 100+ Assets Anytime, Instantly.</p>
        </div>
        <button
          onClick={handleOpenGrand}
          style={{ 
            width: 300, height: 60, fontSize: 20, backgroundColor: '#FFB9DF', 
            color: '#0B051D', cursor: 'pointer', border: 'none', 
            borderRadius: '8px', fontWeight: 'bold' 
          }}
        >
          Open Grand
        </button>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}