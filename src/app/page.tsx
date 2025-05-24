import Link from 'next/link'; // Next.jsのリンク機能をインポートします

export default function HomePage() {
  return (
    <main>
      <div>
        <h1>私のポートフォリオサイトへようこそ！！！</h1>
        <p>
          私の作品や活動について、ぜひご覧ください。
        </p>
        <p>
          {/* ここにプロフィールページへのリンクを追加します */}
          <Link href="/profile">
            プロフィールを見る
          </Link>
        </p>
        <p>
          {/* ここにイラスト作品一覧ページへのリンクを追加します */}
          <Link href="/illustrations">
            イラスト作品一覧
          </Link>
        </p>
        <p>
          {/* ここに音楽作品一覧ページへのリンクを追加します */}
          <Link href="/songs">
            音楽作品一覧
          </Link>
        </p>
      </div>
    </main>
  );
}