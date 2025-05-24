import React from "react";
import Link from 'next/link';
const songInfo = {
    title: "Skyland",
    artist: "shenzel",
    releaseDate: "2022-2-28",
    description: `hogehoge`,
    links: [
        { label: "SoundCloud", url: "https://soundcloud.com/nitmic/skyland?in=nitmic/sets/glide-girl&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" }
    ],
};

export default function SkylandPage() {
    return (
        <main style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem" }}>
            <h1>{songInfo.title}</h1>
            <h2>アーティスト: {songInfo.artist}</h2>
            <p>リリース日: {songInfo.releaseDate}</p>
            <section>
                <h3>楽曲紹介</h3>
                <p>{songInfo.description}</p>
            </section>
            <section>
                <h3>配信リンク</h3>
                <ul>
                    {songInfo.links.map((link) => (
                        <li key={link.url}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>
            <p>
              <Link href="/songs">曲情報に戻る</Link> {/* "/music" が一覧ページのパスだと仮定 */}
            </p>

        </main>
    );
}