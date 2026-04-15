'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

type Props = {
  images: GalleryImage[]
}

export default function PhotoGallery({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i - 1 + images.length) % images.length : null))
  }, [images.length])
  const next = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i + 1) % images.length : null))
  }, [images.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, close, prev, next])

  if (!images.length) return null

  return (
    <>
      <div className="photo-gallery">
        {images.map((img, i) => (
          <div key={i} className="gallery-item" onClick={() => setLightboxIndex(i)}>
            <Image src={img.src} alt={img.alt} loading="lazy" fill sizes="(max-width: 768px) 100vw, 33vw" />
            {img.caption && (
              <div className="gallery-item-overlay">
                <span>{img.caption}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={close}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={close} aria-label="Fermer">
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
            />
            {images.length > 1 && (
              <>
                <button className="lightbox-nav lightbox-prev" onClick={prev} aria-label="Précédent">
                  &#8249;
                </button>
                <button className="lightbox-nav lightbox-next" onClick={next} aria-label="Suivant">
                  &#8250;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
