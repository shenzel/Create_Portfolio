// src/app/illustrations/heart-cursor/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import myArtwork from '@/assets/images/illustrations/hoshino-cursor.jpg';

export default function HoshinoCursorPage() {
  return (
    <div>
      <h1>ホシノカーソル</h1> {/* ← ここに作品名 */}
        <Image
            src={myArtwork}
            alt="ホシノカーソルの画像"
            width={500} // 画像の幅を指定
            height={500} // 画像の高さを指定
            style={{ borderRadius: '8px' }} // 角を丸くするスタイル
        />
      <p>種類: マウスカーソル</p>
      <p>
        <Link href="/illustrations">イラスト作品一覧へ戻る</Link>
      </p>
    </div>
  );
}