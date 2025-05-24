// src/app/illustrations/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image'; // Imageコンポーネントをインポート
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter'; // フロントマター解析
import { remark } from 'remark';   // Markdown処理
import html from 'remark-html';    // MarkdownをHTMLに変換
import { notFound } from 'next/navigation'; // 404表示用

// イラストのMarkdownファイルが保存されているディレクトリ
const illustrationsDirectory = path.join(process.cwd(), 'content', 'illustrations');

// 型定義: フロントマターの型を定義しておくと便利です
interface IllustrationFrontmatter {
  title: string;
  imageSrc: string;
  altText: string;
  imageWidth: number;   // 画像の幅
  imageHeight: number;  // 画像の高さ
  description: string;
  // 他にも必要に応じてフィールドを追加 (例: creationDate?: string;)
}

// 指定されたslugに基づいてイラストデータを読み込む関数
async function getIllustrationData(slug: string) {
  const fullPath = path.join(illustrationsDirectory, `${slug}.md`);
  
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
  
  // フロントマターのdescriptionもMarkdownとして解釈しHTMLに変換する場合 (任意)
  // 今回はdescriptionはフロントマターの文字列をそのまま使い、bodyContentHtmlをメインのHTMLコンテンツとします。
  // もしdescriptionもリッチにしたい場合は、別途remarkで処理してください。

  return {
    slug,
    bodyContentHtml,
    ...(matterResult.data as IllustrationFrontmatter), // フロントマターのデータを展開
  };
}

// ページコンポーネント
export default async function IllustrationPage({ params }: { params: { slug: string } }) {
  const illustrationData = await getIllustrationData(params.slug);

  if (!illustrationData) {
    notFound(); // データが見つからなければ404ページを表示
  }

  // フロントマターのdescriptionの改行を<br />に変換 (単純なテキストの場合)
  const descriptionWithBreaks = illustrationData.description.replace(/\n/g, '<br />');

  return (
    <main style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
      <h1>{illustrationData.title}</h1>
      
      <div style={{ marginTop: '30px', marginBottom: '30px', display: 'inline-block' }}>
        <Image
          src={illustrationData.imageSrc}
          alt={illustrationData.altText}
          width={illustrationData.imageWidth}   // フロントマターから幅を取得
          height={illustrationData.imageHeight}  // フロントマターから高さを取得
          style={{ 
            maxWidth: '100%', // 親要素の幅を超えないように
            height: 'auto',   // アスペクト比を保つ
            // ドット絵の場合は、ここに imageRendering: 'pixelated'などを追加することも検討
            // imageRendering: 'pixelated',
          }}
          priority // ページの中心的な画像であれば、優先的に読み込む設定 (LCP改善)
        />
      </div>
      
      <section style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
        <h3>作品紹介</h3>
        {/* フロントマターのdescriptionを表示 (改行を<br>に変換) */}
        <div dangerouslySetInnerHTML={{ __html: descriptionWithBreaks }} />

        {/* Markdown本文がある場合は表示 (空の<p></p>タグなどを除外) */}
        {illustrationData.bodyContentHtml && illustrationData.bodyContentHtml.trim() !== "<p></p>" && illustrationData.bodyContentHtml.trim() !== "" && (
          <div 
            style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}} 
            dangerouslySetInnerHTML={{ __html: illustrationData.bodyContentHtml }} 
          />
        )}
      </section>
      
      <p style={{ marginTop: '30px' }}>
        <Link href="/illustrations">イラスト作品一覧へ戻る</Link>
      </p>
    </main>
  );
}

// generateStaticParams 関数の追加 (ビルド時に静的ページを生成)
export async function generateStaticParams() {
  const files = fs.readdirSync(illustrationsDirectory);
  const paths = files
    .filter(fileName => fileName.endsWith('.md')) // .mdファイルのみを対象
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''), // .md拡張子を取り除く
    }));
  return paths;
}