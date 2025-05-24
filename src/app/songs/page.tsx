const songSites = [
    {
        name: "IFs Liberation",
        url: "songs/IFs-Liberation",
    },
    {
        name: "Skyland",
        url: "songs/Skyland",
    }
    
];

export default function SongsPage() {
    return (
        <main>
            <h1>楽曲情報</h1>
            <ul>
                {songSites.map((site) => (
                    <li key={site.url}>
                        <a href={site.url} target="_blank" rel="noopener noreferrer">
                            {site.name}
                        </a>
                    </li>
                ))}
            </ul>
            <p>
                <a href="../">トップに戻る</a>
            </p>
        </main>
    );
}