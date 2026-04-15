'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { InstagramPost } from '@/types'
import type { FacebookPost } from '@/app/api/social/facebook/route'
import type { Tweet } from '@/app/api/social/twitter/route'

type SocialConfig = {
  instagramUrl?: string
  facebookUrl?: string
  twitterUrl?: string
  twitterHandle?: string
  hasInstagram?: boolean
  hasFacebook?: boolean
  hasTwitter?: boolean
}

type Tab = 'instagram' | 'facebook' | 'twitter'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  const d = Math.floor(h / 24)
  return `il y a ${d}j`
}

export default function SocialWall({
  instagramUrl,
  facebookUrl,
  twitterUrl,
  twitterHandle,
  hasInstagram = false,
  hasFacebook = false,
  hasTwitter = false,
}: SocialConfig) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    ...(hasInstagram ? [{ id: 'instagram' as Tab, label: 'Instagram', icon: '📸' }] : []),
    ...(hasFacebook ? [{ id: 'facebook' as Tab, label: 'Facebook', icon: '📘' }] : []),
    ...(hasTwitter ? [{ id: 'twitter' as Tab, label: 'X / Twitter', icon: '𝕏' }] : []),
  ]

  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]?.id ?? 'instagram')
  const [instaposts, setInstaPosts] = useState<InstagramPost[]>([])
  const [fbPosts, setFbPosts] = useState<FacebookPost[]>([])
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!activeTab) return
    setLoading(true)

    if (activeTab === 'instagram' && hasInstagram && instaposts.length === 0) {
      fetch('/api/social/instagram')
        .then(r => r.json())
        .then(d => setInstaPosts(d.posts ?? []))
        .finally(() => setLoading(false))
    } else if (activeTab === 'facebook' && hasFacebook && fbPosts.length === 0) {
      fetch('/api/social/facebook')
        .then(r => r.json())
        .then(d => setFbPosts(d.posts ?? []))
        .finally(() => setLoading(false))
    } else if (activeTab === 'twitter' && hasTwitter && tweets.length === 0) {
      fetch('/api/social/twitter')
        .then(r => r.json())
        .then(d => setTweets(d.tweets ?? []))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  if (tabs.length === 0) return null

  return (
    <section className="social-wall" aria-label="Nos réseaux sociaux">
      <div className="container">
        <h2 className="section-title">Suivez-nous</h2>

        {tabs.length > 1 && (
          <div className="social-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`social-tab ${tab.id}${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Chargement…</div>
        )}

        {!loading && activeTab === 'instagram' && (
          instaposts.length > 0 ? (
            <div className="instagram-grid">
              {instaposts.slice(0, 9).map(post => (
                <a
                  key={post.id}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-grid-item"
                  aria-label={post.caption?.slice(0, 80)}
                >
                  <Image
                    src={post.mediaType === 'VIDEO' ? (post.thumbnailUrl ?? post.mediaUrl) : post.mediaUrl}
                    alt={post.caption?.slice(0, 100) ?? 'Post Instagram'}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  {post.mediaType === 'VIDEO' && <div className="video-badge">▶</div>}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', padding: '2rem 0' }}>Aucun post Instagram disponible.</p>
          )
        )}

        {!loading && activeTab === 'facebook' && (
          fbPosts.length > 0 ? (
            <div className="social-posts-grid">
              {fbPosts.map(post => (
                <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="social-post">
                  {post.fullPicture && (
                    <div className="social-post-image">
                      <Image src={post.fullPicture} alt="" fill style={{ objectFit: 'cover' }} sizes="300px" />
                    </div>
                  )}
                  <div className="social-post-body">
                    <div className="social-post-meta">
                      <span className="social-post-source source-facebook">Facebook</span>
                      <span>{timeAgo(post.createdTime)}</span>
                    </div>
                    {(post.message || post.story) && (
                      <p className="social-post-text">{post.message ?? post.story}</p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', padding: '2rem 0' }}>Aucun post Facebook disponible.</p>
          )
        )}

        {!loading && activeTab === 'twitter' && (
          tweets.length > 0 ? (
            <div className="social-posts-grid">
              {tweets.map(tweet => (
                <a key={tweet.id} href={tweet.url} target="_blank" rel="noopener noreferrer" className="social-post">
                  {tweet.mediaUrl && (
                    <div className="social-post-image">
                      <Image src={tweet.mediaUrl} alt="" fill style={{ objectFit: 'cover' }} sizes="300px" />
                    </div>
                  )}
                  <div className="social-post-body">
                    <div className="social-post-meta">
                      <span className="social-post-source source-twitter">𝕏 Twitter</span>
                      <span>{timeAgo(tweet.createdAt)}</span>
                    </div>
                    <p className="social-post-text">{tweet.text}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#94a3b8', padding: '2rem 0' }}>Aucun tweet disponible.</p>
          )
        )}

        <div className="social-links-bar">
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link-btn instagram">
              📸 Instagram
            </a>
          )}
          {facebookUrl && (
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="social-link-btn facebook">
              📘 Facebook
            </a>
          )}
          {twitterUrl && (
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="social-link-btn twitter">
              𝕏 Twitter
            </a>
          )}
          {!instagramUrl && !facebookUrl && !twitterUrl && twitterHandle && (
            <a href={`https://x.com/${twitterHandle}`} target="_blank" rel="noopener noreferrer" className="social-link-btn twitter">
              𝕏 @{twitterHandle}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
