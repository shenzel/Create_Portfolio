// src/app/songs/[slug]/page.tsx

import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation'; // notFound関数をインポート

// Markdownファイルが保存されているディレクトリ
const postsDirectory = path.join(process.cwd(), 'content', 'songs'); // "music" から "songs" に変更

// 指定されたslugに基づいてMarkdownファイルからデータを読み込む関数
async function getSongData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    // ファイルが存在しない場合は null や undefined ではなく、ここで notFound() を呼ぶ
    return null; 
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug, // slugも返しておくと便利
    contentHtml,
    ...(matterResult.data as { title: string; artist: string; releaseDate: string; description:string; soundcloudUrl?: string }),
  };
}

// ページコンポーネント: paramsオブジェクトからslugを受け取る
export default async function SongPage({ params }: { params: { slug: string } }) {
  const songData = await getSongData(params.slug);

  if (!songData) {
    // getSongData でファイルが見つからない場合など、データがない場合は404ページを表示
    notFound();
  }

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h1>{songData.title}</h1>
      <h2>アーティスト: {songData.artist}</h2>
      <p>リリース日: {songData.releaseDate}</p>
      
      <section style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h3>楽曲紹介</h3>
        <div dangerouslySetInnerHTML={{ __html: songData.description.replace(/\n/g, '<br />') }} />
        {/* もしMarkdown本文も表示する場合は以下 */}
        {/* <div dangerouslySetInnerHTML={{ __html: songData.contentHtml }} /> */}
      </section>
      
      {songData.soundcloudUrl && (
        <section style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h3>試聴・配信</h3>
          <p>
            <a href={songData.soundcloudUrl} target="_blank" rel="noopener noreferrer">
              SoundCloudで聴く
            </a>
          </p>
        </section>
      )}
      
      <p style={{ marginTop: '30px' }}>
        <Link href="/songs">作曲作品一覧へ戻る</Link> {/* "/songs" が一覧ページのパスだと仮定 */}
      </p>
    </main>
  );
}

// src/app/songs/[slug]/page.tsx の末尾に以下を追加

export async function generateStaticParams() {
  // content/songs フォルダ内の全ての.mdファイル名を取得
  const files = fs.readdirSync(postsDirectory);

  // 各ファイル名から .md を取り除いてslugのリストを作成
  const paths = files.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));

  return paths;
}