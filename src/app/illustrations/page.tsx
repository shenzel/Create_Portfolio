// src/app/illustrations/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// イラストのMarkdownファイルが保存されているディレクトリ
const illustrationsDirectory = path.join(process.cwd(), 'content', 'illustrations');

// リスト表示用のイラストデータの型 (任意ですが、型安全のために推奨)
interface IllustrationForList {
  slug: string;
  title: string;
  imageSrc?: string; // サムネイル用 (フロントマターにある場合)
  altText?: string;  // サムネイルのaltテキスト
  // 必要であれば他のフロントマターのフィールドも追加 (例: shortDescription?: string)
}

// 全てのイラストのデータを取得する関数
function getAllIllustrationsForList(): IllustrationForList[] {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(illustrationsDirectory);
  } catch (err) {
    // content/illustrations フォルダが存在しないなどの場合は空のリストを返す
    console.warn("Could not read illustrations directory. Returning empty list.", err);
    return [];
  }

  const allIllustrations = fileNames
    .filter(fileName => fileName.endsWith('.md')) // .mdファイルのみを対象
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, ''); // ファイル名から.mdを除去してslugに
      const fullPath = path.join(illustrationsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents); // フロントマターをパース

      return {
        slug,
        title: matterResult.data.title || '無題のイラスト', // titleがなければデフォルト値を設定
        imageSrc: matterResult.data.imageSrc, // サムネイル用の画像パス
        altText: matterResult.data.altText || matterResult.data.title || 'イラスト作品',
      } as IllustrationForList;
    });

  // ここで日付などでソートすることも可能 (例: フロントマターにcreationDateがある場合)
  // allIllustrations.sort((a, b) => (a.creationDate < b.creationDate ? 1 : -1));

  return allIllustrations;
}


// イラスト一覧ページコンポーネント
export default async function IllustrationsListPage() {
  const illustrations = getAllIllustrationsForList();

  if (!illustrations || illustrations.length === 0) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>イラスト作品一覧</h1>
        <p>まだ登録されているイラスト作品がありません。</p>
        <p style={{ marginTop: '2rem' }}>
          <Link href="/">ホームページへ戻る</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>イラスト作品一覧</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // レスポンシブなグリッド
        gap: '1.5rem' 
      }}>
        {illustrations.map((illustration) => (
          <Link key={illustration.slug} href={`/illustrations/${illustration.slug}`} style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            border: '1px solid #eee', 
            borderRadius: '8px', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {illustration.imageSrc && (
              <div style={{ 
                width: '100%', 
                aspectRatio: '1 / 1', // サムネイルを正方形に (または画像のアスペクト比に合わせる)
                position: 'relative', 
                marginBottom: '0.75rem',
                overflow: 'hidden', // 画像がはみ出ないように
                borderRadius: '4px'
              }}>
                <Image
                  src={illustration.imageSrc}
                  alt={illustration.altText || illustration.title}
                  fill // 親要素のサイズに合わせる
                  style={{ objectFit: 'cover' }} // コンテナをカバーするように画像を調整 (または 'contain')
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px" // レスポンシブな画像サイズ指定
                />
              </div>
            )}
            <h2 style={{ fontSize: '1.1rem', margin: '0' }}>{illustration.title}</h2>
          </Link>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/">ホームページへ戻る</Link>
      </p>
    </main>
  );
}