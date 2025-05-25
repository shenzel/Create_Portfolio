// src/app/songs/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image'; // ジャケット画像用にインポート
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';

// 作曲作品のMarkdownファイルが保存されているディレクトリ
const songsDirectory = path.join(process.cwd(), 'content', 'songs');

// フロントマターの型定義
interface SongFrontmatter {
  title: string;
  artist: string;
  releaseDate: string;
  description: string;
  soundcloudUrl?: string;
  jacketImageSrc?: string;    // ジャケット画像のパス (publicフォルダから)
  jacketImageAltText?: string; // ジャケット画像のaltテキスト
  jacketImageWidth?: number;   // ジャケット画像の実際の幅
  jacketImageHeight?: number;  // ジャケット画像の実際の高さ
  // 他にも必要に応じてフィールドを追加
}

// getSongData関数の戻り値の型
interface SongData extends SongFrontmatter {
  slug: string;                 // slugは解決済みの文字列
  bodyContentHtml: string;      // Markdown本文のHTML
  descriptionHtml: string;      // descriptionをHTML化した場合 (または改行処理したdescription)
}

// ページコンポーネントのプロパティの型 (generateMetadata の例に合わせる)
type Props = {
  params: Promise<{ slug: string }>; // params を Promise として定義
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // searchParams も Promise (オプショナル)
};

// 指定されたslugに基づいて楽曲データを読み込む関数
async function getSongData(slug: string): Promise<SongData | null> {
  const fullPath = path.join(songsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null; // ファイルが存在しない場合はnullを返す
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents); // フロントマターと本文をパース

  // Markdown本文 (---の下の部分) をHTMLに変換
  const processedBodyContent = await remark()
    .use(html)
    .process(matterResult.content);
  const bodyContentHtml = processedBodyContent.toString();
  
  // フロントマターのdescriptionをHTMLに変換（または改行を<br>に変換）
  // ここでは改行を<br>に変換するシンプルな例を採用します
  const descriptionHtml = (matterResult.data.description as string || "").replace(/\n/g, '<br />');

  return {
    slug,
    bodyContentHtml,
    ...(matterResult.data as SongFrontmatter), // フロントマターのデータを展開
    descriptionHtml, // 処理済みのdescription
  };
}

// ページコンポーネント: params を await で解決
export default async function SongPage({ params: paramsPromise}: Props) {
  const params = await paramsPromise; // params を await で解決
  // const searchParams = _searchParamsPromise ? await _searchParamsPromise : undefined; // 必要なら searchParams も解決

  const songData = await getSongData(params.slug); // 解決された params.slug を使用

  if (!songData) {
    notFound(); // データが見つからなければ404ページを表示
  }

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
      {songData.jacketImageSrc && (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Image
            src={songData.jacketImageSrc}
            alt={songData.jacketImageAltText || songData.title}
            width={songData.jacketImageWidth || 300} // フロントマターに指定がなければデフォルト値
            height={songData.jacketImageHeight || 300} // フロントマターに指定がなければデフォルト値
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            priority={true} // 主要なコンテンツ画像として優先読み込み
          />
        </div>
      )}
      
      <h1>{songData.title}</h1>
      <p style={{ fontSize: '1.1rem', color: '#555', marginTop: '-0.5rem', marginBottom: '1rem' }}>
        アーティスト: {songData.artist}
      </p>
      <p>リリース日: {songData.releaseDate}</p>
      
      <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h3>楽曲紹介</h3>
        <div dangerouslySetInnerHTML={{ __html: songData.descriptionHtml }} />
        {/* もしMarkdown本文 (---の下の部分) も表示したい場合は以下 */}
        {songData.bodyContentHtml && songData.bodyContentHtml.trim() !== "<p></p>" && songData.bodyContentHtml.trim() !== "" && (
           <div 
             style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}} 
             dangerouslySetInnerHTML={{ __html: songData.bodyContentHtml }} 
           />
        )}
      </section>
      
      {songData.soundcloudUrl && (
        <section style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h3>試聴・配信</h3>
          <p>
            <a href={songData.soundcloudUrl} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-block',
              padding: '10px 15px',
              backgroundColor: '#ff5500', // SoundCloudカラー
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              SoundCloudで聴く
            </a>
          </p>
          {/* 他の配信プラットフォームへのリンクもここに追加できます */}
        </section>
      )}
      
      <p style={{ marginTop: '3rem' }}>
        <Link href="/songs">作曲作品一覧へ戻る</Link>
      </p>
    </main>
  );
}

// generateStaticParams 関数 (ビルド時に静的ページを生成)
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  let files: string[];
  try {
    files = fs.readdirSync(songsDirectory);
  } catch (e) {
    console.error("Failed to read songs directory for generateStaticParams:", e);
    files = [];
  }
  const paths = files
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
  // Vercelビルドのために、パスが空でも空配列を返すか、エラー処理をする
  return paths; 
}