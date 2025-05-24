// src/app/songs/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 作曲作品のMarkdownファイルが保存されているディレクトリ
const songsDirectory = path.join(process.cwd(), 'content', 'songs');

// リスト表示用の楽曲データの型
interface SongForList {
  slug: string;
  title: string;
  artist?: string;
  jacketImageSrc?: string; // ジャケット画像パス
  jacketImageAltText?: string; // ジャケット画像のaltテキスト
}

// 全ての楽曲データを取得する関数
function getAllSongsForList(): SongForList[] {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(songsDirectory);
  } catch (err) {
    console.warn("Could not read songs directory. Returning empty list.", err);
    return [];
  }

  const allSongs = fileNames
    .filter(fileName => fileName.endsWith('.md')) // .mdファイルのみを対象
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(songsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents); // フロントマターをパース

      return {
        slug,
        title: matterResult.data.title || '無題の曲',
        artist: matterResult.data.artist,
        jacketImageSrc: matterResult.data.jacketImageSrc,
        jacketImageAltText: matterResult.data.jacketImageAltText || matterResult.data.title || 'ジャケットアート',
      } as SongForList;
    });

  // Optional: ここで日付やタイトルでソートする
  // allSongs.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1));

  return allSongs;
}

// 作曲作品一覧ページコンポーネント
export default async function SongsListPage() {
  const songs = getAllSongsForList();

  if (!songs || songs.length === 0) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>作曲作品一覧</h1>
        <p>まだ登録されている楽曲がありません。</p>
        <p style={{ marginTop: '2rem' }}>
          <Link href="/">ホームページへ戻る</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>作曲作品一覧</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', // カードの最小幅を調整
        gap: '1.5rem' 
      }}>
        {songs.map((song) => (
          <Link key={song.slug} href={`/songs/${song.slug}`} style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            border: '1px solid #eee', 
            borderRadius: '8px', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center', // ジャケット画像の表示に合わせて調整
            // textAlign: 'center'
          }}>
            {song.jacketImageSrc && (
              <div style={{ 
                width: '100%', 
                aspectRatio: '1 / 1', // ジャケットを正方形に
                position: 'relative', 
                marginBottom: '0.75rem',
                overflow: 'hidden',
                borderRadius: '4px'
              }}>
                <Image
                  src={song.jacketImageSrc}
                  alt={song.jacketImageAltText || song.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 230px"
                />
              </div>
            )}
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem', marginTop: song.jacketImageSrc ? '0' : '0.5rem' }}>
              {song.title}
            </h2>
            {song.artist && (
              <p style={{ fontSize: '0.9rem', color: '#555', margin: '0' }}>
                {song.artist}
              </p>
            )}
          </Link>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link href="/">ホームページへ戻る</Link>
      </p>
    </main>
  );
}