import Link from "next/link";

const illustrations = [
    { name: "ホシノマウスカーソル", path: "/illustrations/hoshino-cursor" },

    // 必要に応じて追加
];

export default function IlustrationsPage() {
    return (
        <main>
            <h1>イラスト一覧</h1>
            <ul>
                {illustrations.map((item) => (
                    <li key={item.path}>
                        <Link href={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
            <p>
                <Link href="/">トップに戻る</Link>
            </p>
        </main>
    );
}