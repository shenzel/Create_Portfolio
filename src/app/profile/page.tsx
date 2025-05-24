// src/app/profile/page.tsx

export default function ProfilePage() {
  return (
    <div>
      <h1>プロフィール</h1>

      <section style={{ marginBottom: '20px' }}> {/* 少し下に余白を追加 */}
        <h2>自己紹介</h2>
        <p>音街ウナが好きなボカロPです。</p>
        <p>最近はイラストにも手を出し始めています。</p>
      </section>

      <section>
        <h2>主な活動ジャンル</h2>
        <h3>作曲</h3>
        <p>ボカロ</p>
        <h3>イラスト</h3>
        <p>マウスカーソル等ドット絵</p>
      </section>

        <section>
            <h2>使用機材</h2>
            <h3>DAW</h3>
            <p>Studio One 5</p>
            <h3>音源</h3>
            <p>Vocaloid 4 Editor for Cubase</p>
            <p>Vocaloid 5</p>
            <p>VSTi</p>
        </section>
    </div>
  );
}
