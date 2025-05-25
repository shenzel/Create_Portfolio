// src/app/illustrations/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';

const illustrationsDirectory = path.join(process.cwd(), 'content', 'illustrations');

// フロントマターの型定義
interface IllustrationFrontmatter {
  title: string;
  imageSrc: string;
  altText: string;
  imageWidth: number;
  imageHeight: number;
  description: string;
}

// getIllustrationData関数の戻り値の型
interface IllustrationData extends IllustrationFrontmatter {
  slug: string; // slugは解決済みの文字列
  bodyContentHtml: string;
  descriptionHtml: string; 
}

// ★★★ ページコンポーネントのプロパティの型をドキュメントの generateMetadata の例に合わせる ★★★
type Props = {
  params: Promise<{ slug: string }>; // params を Promise として定義
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>; // searchParams も Promise (オプショナル)
};

// getIllustrationData は slug (解決済みの文字列) を受け取るように変更なし
async function getIllustrationData(slug: string): Promise<IllustrationData | null> {
  const fullPath = path.join(illustrationsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) { return null; }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedBodyContent = await remark().use(html).process(matterResult.content);
  const bodyContentHtml = processedBodyContent.toString();
  let descriptionHtml = (matterResult.data.description as string) || "";
  if (matterResult.data.description) {
    const processedDescription = await remark().use(html).process(matterResult.data.description as string);
    descriptionHtml = processedDescription.toString();
  }
  return {
    slug, // ここで渡す slug は解決済みの文字列
    bodyContentHtml,
    ...(matterResult.data as IllustrationFrontmatter),
    descriptionHtml,
  };
}

// ★★★ ページコンポーネントで params を await で解決 ★★★
export default async function IllustrationPage({ params: paramsPromise}: Props) {
  const params = await paramsPromise; // params を await で解決
  // const searchParams = _searchParamsPromise ? await _searchParamsPromise : undefined; // 必要なら searchParams も解決

  const illustrationData = await getIllustrationData(params.slug); // 解決された params.slug を使用

  if (!illustrationData) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 800, margin: '2rem auto', padding: '1rem', textAlign: 'center' }}>
      <h1>{illustrationData.title}</h1>
      <div style={{ marginTop: '30px', marginBottom: '30px', display: 'inline-block' }}>
        <Image
          src={illustrationData.imageSrc}
          alt={illustrationData.altText}
          width={illustrationData.imageWidth}
          height={illustrationData.imageHeight}
          style={{ maxWidth: '100%', height: 'auto' }}
          priority
        />
      </div>
      <section style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
        <h3>作品紹介</h3>
        <div dangerouslySetInnerHTML={{ __html: illustrationData.descriptionHtml }} />
        {illustrationData.bodyContentHtml && illustrationData.bodyContentHtml.trim() !== "<p></p>" && illustrationData.bodyContentHtml.trim() !== "" && (
          <div style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}} dangerouslySetInnerHTML={{ __html: illustrationData.bodyContentHtml }} />
        )}
      </section>
      <p style={{ marginTop: '30px' }}>
        <Link href="/illustrations">イラスト作品一覧へ戻る</Link>
      </p>
    </main>
  );
}

// generateStaticParams は変更なし (これは解決済みのslugのリストを返す)
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const files = fs.readdirSync(illustrationsDirectory);
  const paths = files
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => ({ slug: fileName.replace(/\.md$/, '') }));
  return paths;
}