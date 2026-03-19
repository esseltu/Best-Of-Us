import { AnimatePresence, motion } from 'framer-motion'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { BadgeCheck, Leaf, Search, ShoppingBag, Sparkles, X } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FeaturedCollections from './components/FeaturedCollections.jsx'

const CART_KEY = 'bou_cart'
const LAST_ORDER_KEY = 'bou_last_order'

function readLastOrder() {
  try {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem(LAST_ORDER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeLastOrder(payload) {
  try {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(payload))
  } catch {
    return
  }
}

function createOrderId() {
  const partA = Date.now().toString(36).slice(-4).toUpperCase()
  const partB = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BOU-${partA}${partB}`
}

const PRODUCTS = [
  {
    id: 'tee-001',
    name: 'BOU Classic Tee',
    category: 'Tees',
    price: 29.0,
    badge: 'Best Seller',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.14),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.46))]',
  },
  {
    id: 'tee-002',
    name: 'Everyday Fit Tee',
    category: 'Tees',
    price: 32.0,
    badge: 'New',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_70%_25%,rgba(11,61,46,0.38),transparent_55%),radial-gradient(circle_at_25%_85%,rgba(0,0,0,0.55),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(0,0,0,0.24))]',
  },
  {
    id: 'tee-003',
    name: 'Heavyweight Signature Tee',
    category: 'Tees',
    price: 38.0,
    badge: 'Premium',
    soldOut: true,
    gradient:
      'bg-[radial-gradient(circle_at_35%_70%,rgba(0,0,0,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.76),rgba(255,255,255,0.44))]',
  },
  {
    id: 'hood-001',
    name: 'Liquid Glass Hoodie',
    category: 'Hoodies',
    price: 74.0,
    badge: 'Featured',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.14),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.46))]',
  },
  {
    id: 'hood-002',
    name: 'Everyday Zip Hoodie',
    category: 'Hoodies',
    price: 82.0,
    badge: 'New',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_70%_25%,rgba(11,61,46,0.38),transparent_55%),radial-gradient(circle_at_25%_85%,rgba(0,0,0,0.55),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(0,0,0,0.24))]',
  },
  {
    id: 'jack-001',
    name: 'Glass Shell Jacket',
    category: 'Jackets',
    price: 118.0,
    badge: 'Limited',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_20%_25%,rgba(0,0,0,0.14),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.76),rgba(255,255,255,0.44))]',
  },
  {
    id: 'jack-002',
    name: 'Minimal Bomber',
    category: 'Jackets',
    price: 132.0,
    badge: 'Premium',
    soldOut: true,
    gradient:
      'bg-[radial-gradient(circle_at_70%_25%,rgba(11,61,46,0.38),transparent_55%),radial-gradient(circle_at_25%_85%,rgba(0,0,0,0.55),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(0,0,0,0.24))]',
  },
  {
    id: 'pant-001',
    name: 'Relaxed Utility Pant',
    category: 'Pants',
    price: 86.0,
    badge: 'Best Seller',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_30%_25%,rgba(0,0,0,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.46))]',
  },
  {
    id: 'pant-002',
    name: 'Cloud Knit Jogger',
    category: 'Pants',
    price: 78.0,
    badge: 'New',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_70%_25%,rgba(11,61,46,0.38),transparent_55%),radial-gradient(circle_at_25%_85%,rgba(0,0,0,0.55),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(0,0,0,0.24))]',
  },
  {
    id: 'acc-001',
    name: 'Signature Cap',
    category: 'Accessories',
    price: 32.0,
    badge: 'Essentials',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_30%_25%,rgba(0,0,0,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.76),rgba(255,255,255,0.44))]',
  },
  {
    id: 'acc-002',
    name: 'Everyday Tote',
    category: 'Accessories',
    price: 28.0,
    badge: 'New',
    soldOut: true,
    gradient:
      'bg-[radial-gradient(circle_at_70%_25%,rgba(11,61,46,0.38),transparent_55%),radial-gradient(circle_at_25%_85%,rgba(0,0,0,0.55),transparent_60%),linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(0,0,0,0.24))]',
  },
  {
    id: 'acc-003',
    name: 'Minimal Socks (3-pack)',
    category: 'Accessories',
    price: 22.0,
    badge: 'Essentials',
    soldOut: false,
    gradient:
      'bg-[radial-gradient(circle_at_40%_25%,rgba(0,0,0,0.12),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.46))]',
  },
]

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])
  return null
}

function Page({ title, subtitle, children }) {
  const MotionSection = motion.section
  return (
    <MotionSection
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass glass-hover rounded-3xl p-6 md:p-10"
    >
      <div className="flex flex-col gap-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-2xl text-sm leading-relaxed text-zinc-700">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </MotionSection>
  )
}

function PlaceholderRow() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl p-4 shadow-none md:p-5"
        >
          <div className="h-3 w-20 rounded-full bg-black/10" />
          <div className="mt-4 h-24 rounded-xl bg-black/5" />
          <div className="mt-4 h-3 w-28 rounded-full bg-black/10" />
        </div>
      ))}
    </div>
  )
}

function HeroSection() {
  const MotionSection = motion.section
  const MotionDiv = motion.div

  return (
    <MotionSection
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-glass backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.16),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_42%,rgba(0,0,0,0.10))]" />
        </div>

        <div className="relative grid min-h-[calc(100dvh-8rem)] items-center gap-8 p-6 md:grid-cols-12 md:gap-10 md:p-10">
          <MotionDiv
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:col-span-5"
          >
            <div className="text-left">
              <div className="text-sm font-medium tracking-tight text-white/70">
                The Best Of Us
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Discover Your Style
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                Explore the latest trends and timeless essentials crafted for a
                confident, inclusive lifestyle.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-white/90"
                >
                  Shop Now
                </Link>
                <Link
                  to="/collections"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/15"
                >
                  View Collections
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {['Free Shipping', 'Best Seller', 'Sale'].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-xl"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:col-span-7"
          >
            <div className="relative mx-auto w-full max-w-2xl">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-glass backdrop-blur-2xl">
                <div className="absolute inset-0 opacity-70">
                  <div className="absolute -left-16 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                </div>
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src={getProductImageSrc({
                      id: 'hero',
                      name: 'Best Of Us',
                      category: 'Alpine Essentials',
                    })}
                    alt="Best Of Us"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-[82%] w-[78%] rounded-2xl bg-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset]" />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.12),transparent_30%,rgba(0,0,0,0.20))]" />
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </MotionSection>
  )
}

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function hashString(input) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getInitials(name) {
  const safe = String(name || '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
  if (!safe) return 'BOU'
  const parts = safe.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] ?? 'B'
  const last = parts[parts.length - 1]?.[0] ?? 'O'
  return `${first}${last}`.toUpperCase().slice(0, 2)
}

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function getProductImageSrc(product) {
  const id = product?.id ? String(product.id) : 'bou'
  const name = product?.name ? String(product.name) : 'Best Of Us'
  const category = product?.category ? String(product.category) : 'Essentials'
  const initials = getInitials(name)
  const seed = hashString(id) % 1000
  const offsetA = (seed % 60) - 30
  const offsetB = ((seed * 3) % 70) - 35
  const offsetC = ((seed * 7) % 90) - 45
  const alpine = '#0B3D2E'
  const ink = '#050607'

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${alpine}"/>
      <stop offset="55%" stop-color="${ink}"/>
      <stop offset="100%" stop-color="${alpine}"/>
    </linearGradient>
    <radialGradient id="spotA" cx="22%" cy="18%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="70%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
    <radialGradient id="spotB" cx="80%" cy="78%" r="60%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.45)"/>
      <stop offset="70%" stop-color="rgba(24,24,27,0)"/>
    </radialGradient>
    <filter id="blur24" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
  </defs>

  <rect width="960" height="720" rx="56" fill="url(#bg)"/>
  <rect width="960" height="720" rx="56" fill="url(#spotA)"/>
  <rect width="960" height="720" rx="56" fill="url(#spotB)"/>

  <g opacity="0.22" filter="url(#blur24)">
    <circle cx="${210 + offsetA}" cy="${160 + offsetB}" r="160" fill="rgba(255,255,255,0.18)"/>
    <circle cx="${760 + offsetB}" cy="${560 + offsetC}" r="200" fill="rgba(11,61,46,0.55)"/>
    <circle cx="${820 + offsetC}" cy="${180 + offsetA}" r="140" fill="rgba(0,0,0,0.55)"/>
  </g>

  <g opacity="0.22">
    <path d="M120 500 C240 420, 340 620, 480 520 C640 400, 720 620, 860 520" fill="none" stroke="rgba(24,24,27,0.22)" stroke-width="10" stroke-linecap="round"/>
    <path d="M130 540 C260 460, 360 660, 500 560 C660 440, 740 660, 850 560" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="8" stroke-linecap="round"/>
  </g>

  <g>
    <rect x="74" y="86" width="812" height="548" rx="44" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.16)"/>
    <rect x="98" y="110" width="764" height="500" rx="40" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.14)"/>
  </g>

  <g font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" fill="rgba(255,255,255,0.92)">
    <text x="120" y="512" font-size="96" font-weight="700" letter-spacing="-1">${initials}</text>
    <text x="120" y="560" font-size="28" font-weight="600" fill="rgba(255,255,255,0.70)">${category}</text>
    <text x="120" y="605" font-size="34" font-weight="650" letter-spacing="-0.3">${name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
  </g>
</svg>`

  return svgToDataUri(svg)
}

function lockBodyScroll() {
  const body = document.body
  const raw = body.dataset.bouScrollLockCount ?? '0'
  const count = Number.parseInt(raw, 10) || 0
  if (count === 0) body.dataset.bouPrevOverflow = body.style.overflow || ''
  body.dataset.bouScrollLockCount = String(count + 1)
  body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  const body = document.body
  const raw = body.dataset.bouScrollLockCount ?? '0'
  const count = Number.parseInt(raw, 10) || 0
  if (count <= 1) {
    body.style.overflow = body.dataset.bouPrevOverflow ?? ''
    delete body.dataset.bouPrevOverflow
    delete body.dataset.bouScrollLockCount
    return
  }
  body.dataset.bouScrollLockCount = String(count - 1)
}

function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return
    lockBodyScroll()
    return () => unlockBodyScroll()
  }, [active])
}

function readCartItems() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item) => item && typeof item.productId === 'string')
      .map((item) => ({
        productId: item.productId,
        quantity:
          typeof item.quantity === 'number' && Number.isFinite(item.quantity)
            ? Math.max(1, Math.floor(item.quantity))
            : 1,
      }))
  } catch {
    return []
  }
}

function writeCartItems(nextItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(nextItems))
  window.dispatchEvent(new Event('bou_cart_updated'))
}

function addToCart(productId, quantity) {
  const safeQty =
    typeof quantity === 'number' && Number.isFinite(quantity)
      ? Math.max(1, Math.floor(quantity))
      : 1
  const items = readCartItems()
  const idx = items.findIndex((i) => i.productId === productId)
  const next =
    idx >= 0
      ? items.map((i, iIdx) =>
          iIdx === idx ? { ...i, quantity: i.quantity + safeQty } : i
        )
      : [...items, { productId, quantity: safeQty }]
  writeCartItems(next)
}

function setCartItemQuantity(productId, quantity) {
  const safeQty =
    typeof quantity === 'number' && Number.isFinite(quantity)
      ? Math.max(0, Math.floor(quantity))
      : 1
  const items = readCartItems()
  const idx = items.findIndex((i) => i.productId === productId)

  const next =
    safeQty <= 0
      ? items.filter((i) => i.productId !== productId)
      : idx >= 0
        ? items.map((i, iIdx) =>
            iIdx === idx ? { ...i, quantity: safeQty } : i
          )
        : [...items, { productId, quantity: safeQty }]

  writeCartItems(next)
}

function clearCart() {
  writeCartItems([])
}

function useCartItems() {
  const [items, setItems] = useState(() =>
    typeof window === 'undefined' ? [] : readCartItems()
  )

  useEffect(() => {
    const sync = () => setItems(readCartItems())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('bou_cart_updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('bou_cart_updated', sync)
    }
  }, [])

  return items
}

function CategoryPill({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-4 py-2 text-sm font-semibold transition',
        active
          ? 'bg-zinc-950 text-white'
          : 'border border-black/10 bg-white/60 text-zinc-800 backdrop-blur-2xl hover:bg-white/75',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function ProductCard({ product, onView }) {
  const MotionDiv = motion.div
  return (
    <MotionDiv
      whileHover={product.soldOut ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass group relative overflow-hidden rounded-3xl"
      role="button"
      tabIndex={0}
      onClick={() => onView?.(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onView?.(product)
      }}
    >
      <div className={`absolute inset-0 ${product.gradient}`} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_35%,rgba(0,0,0,0.06))]" />

      <div className="relative p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight text-zinc-950">
              {product.name}
            </div>
            <div className="mt-1 text-xs font-medium text-zinc-700">
              {product.category}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-2xl">
              {product.badge}
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white/35">
          <div className="relative aspect-[4/3] w-full">
            <img
              src={getProductImageSrc(product)}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.40),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.28),transparent_55%,rgba(0,0,0,0.12))]" />

            {product.soldOut ? (
              <div className="absolute inset-0 grid place-items-center bg-zinc-950/25 backdrop-blur-sm">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950">
                  Sold Out
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-zinc-950">
            {formatPrice(product.price)}
          </div>
          <button
            type="button"
            disabled={product.soldOut}
            onClick={(e) => {
              e.stopPropagation()
              onView?.(product)
            }}
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              product.soldOut
                ? 'cursor-not-allowed bg-zinc-950/10 text-zinc-500'
                : 'bg-zinc-950 text-white hover:bg-zinc-900',
            ].join(' ')}
          >
            View
          </button>
        </div>
      </div>
    </MotionDiv>
  )
}

function ProductQuickViewPanel({ product, onClose }) {
  const MotionDiv = motion.div
  const [quantity, setQuantity] = useState(1)
  const canAdd = !product.soldOut

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 14, scale: 0.98, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(10px)' }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-white/60 shadow-glass backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.80),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(24,24,27,0.10),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.55),rgba(255,255,255,0.35))]" />

      <div className="relative flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-zinc-950">
            {product.name}
          </div>
          <div className="mt-0.5 text-xs font-medium text-zinc-700">
            {product.category} · {product.badge}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative grid gap-6 p-5 md:grid-cols-2 md:p-6">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/45">
          <div className={`absolute inset-0 ${product.gradient}`} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_35%,rgba(0,0,0,0.06))]" />
          <div className="relative aspect-[4/3] w-full">
            <img
              src={getProductImageSrc(product)}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.35),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.25),transparent_55%,rgba(0,0,0,0.10))]" />
            {product.soldOut ? (
              <div className="absolute inset-0 grid place-items-center bg-zinc-950/25 backdrop-blur-sm">
                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-950">
                  Sold Out
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-2xl font-semibold tracking-tight text-zinc-950">
            {formatPrice(product.price)}
          </div>
          <div className="mt-2 text-sm leading-relaxed text-zinc-700">
            Clean silhouette. Premium feel. Built to layer with everything in
            your rotation.
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-3xl border border-black/10 bg-white/55 px-4 py-3 backdrop-blur-2xl">
            <div className="text-sm font-semibold text-zinc-900">Quantity</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-sm font-semibold text-zinc-900 transition hover:bg-white/75"
              >
                −
              </button>
              <div className="min-w-10 text-center text-sm font-semibold text-zinc-950">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-sm font-semibold text-zinc-900 transition hover:bg-white/75"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              disabled={!canAdd}
              onClick={() => {
                if (product.soldOut) return
                addToCart(product.id, quantity)
                onClose?.()
              }}
              className={[
                'w-full rounded-full px-5 py-3 text-sm font-semibold transition',
                canAdd
                  ? 'bg-zinc-950 text-white hover:bg-zinc-900'
                  : 'cursor-not-allowed bg-zinc-950/10 text-zinc-500',
              ].join(' ')}
            >
              {product.soldOut ? 'Sold Out' : 'Add to Cart'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
            >
              Continue Shopping
            </button>
          </div>

          <div className="mt-auto pt-6 text-xs font-medium text-zinc-600">
            Free shipping on orders over $75 · Easy returns
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}

function ProductQuickViewModal({ product, open, onClose }) {
  const MotionDiv = motion.div
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    open && product
      ? createPortal(
          <AnimatePresence>
            <MotionDiv
              className="fixed inset-0 z-50 grid place-items-center px-4 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              />
              <ProductQuickViewPanel
                key={product.id}
                product={product}
                onClose={onClose}
              />
            </MotionDiv>
          </AnimatePresence>,
          document.body
        )
      : null
  )
}

function CartSidebarModal({ open, onCheckout, onClose }) {
  const MotionDiv = motion.div
  const MotionAside = motion.aside
  const items = useCartItems()
  useBodyScrollLock(open)

  const lineItems = useMemo(() => {
    return items
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId) ?? null
        if (!product) return null
        return {
          product,
          quantity: item.quantity,
          total: product.price * item.quantity,
        }
      })
      .filter(Boolean)
  }, [items])

  const subtotal = useMemo(
    () => lineItems.reduce((sum, li) => sum + li.total, 0),
    [lineItems]
  )

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0),
    [items]
  )

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return open
    ? createPortal(
        <AnimatePresence>
          <MotionDiv
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close cart"
              onClick={onClose}
              className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            />

            <MotionAside
              initial={{ x: 24, opacity: 0, filter: 'blur(10px)' }}
              animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ x: 24, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-md overflow-hidden border-l border-white/20 bg-white/60 shadow-glass backdrop-blur-2xl"
              role="dialog"
              aria-modal="true"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,0.85),transparent_50%),radial-gradient(circle_at_90%_10%,rgba(24,24,27,0.10),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.60),rgba(255,255,255,0.38))]" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-zinc-950">
                        Cart
                      </div>
                      <div className="text-xs font-medium text-zinc-700">
                        {totalCount} item{totalCount === 1 ? '' : 's'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {lineItems.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                    <div className="text-sm font-semibold text-zinc-950">
                      Your cart is empty
                    </div>
                    <div className="text-sm text-zinc-700">
                      Add something clean and confident.
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      <div className="grid gap-3">
                        {lineItems.map((li) => (
                          <div
                            key={li.product.id}
                            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 p-4 backdrop-blur-2xl"
                          >
                            <div
                              className={`pointer-events-none absolute inset-0 ${li.product.gradient}`}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_45%,rgba(0,0,0,0.06))]" />

                            <div className="relative flex items-start gap-3">
                              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-black/10 bg-white/35">
                                <img
                                  src={getProductImageSrc(li.product)}
                                  alt={li.product.name}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-zinc-950">
                                  {li.product.name}
                                </div>
                                <div className="mt-1 text-xs font-medium text-zinc-700">
                                  {li.product.category} ·{' '}
                                  {formatPrice(li.product.price)}
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCartItemQuantity(
                                          li.product.id,
                                          li.quantity - 1
                                        )
                                      }
                                      className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-sm font-semibold text-zinc-900 transition hover:bg-white/75"
                                    >
                                      −
                                    </button>
                                    <div className="min-w-10 text-center text-sm font-semibold text-zinc-950">
                                      {li.quantity}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCartItemQuantity(
                                          li.product.id,
                                          li.quantity + 1
                                        )
                                      }
                                      className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-sm font-semibold text-zinc-900 transition hover:bg-white/75"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <div className="text-sm font-semibold text-zinc-950">
                                    {formatPrice(li.total)}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setCartItemQuantity(li.product.id, 0)}
                                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
                                aria-label="Remove"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-black/10 px-5 py-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium text-zinc-700">
                          Subtotal
                        </div>
                        <div className="font-semibold text-zinc-950">
                          {formatPrice(subtotal)}
                        </div>
                      </div>
                      <div className="mt-1 text-xs font-medium text-zinc-600">
                        Taxes and shipping calculated at checkout.
                      </div>

                      <div className="mt-4 grid gap-3">
                        <button
                          type="button"
                          onClick={onCheckout}
                          className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-900"
                          disabled={lineItems.length === 0}
                        >
                          Checkout
                        </button>
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => clearCart()}
                            className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
                          >
                            Clear Cart
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </MotionAside>
          </MotionDiv>
        </AnimatePresence>,
        document.body
      )
    : null
}

function ShopPage() {
  const MotionSection = motion.section
  const MotionDiv = motion.div
  const [params, setParams] = useSearchParams()
  const qParam = (params.get('q') ?? '').trim()
  const catParam = (params.get('cat') ?? 'all').trim()
  const [searchValue, setSearchValue] = useState(qParam)

  useEffect(() => {
    setSearchValue(qParam)
  }, [qParam])

  const categories = useMemo(() => {
    const set = new Set(PRODUCTS.map((p) => p.category))
    return ['All', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    const q = qParam.toLowerCase()
    const cat = catParam.toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchesCategory =
        cat === 'all' || p.category.toLowerCase() === cat
      const haystack = `${p.name} ${p.category} ${p.badge}`.toLowerCase()
      const matchesQuery = !q || haystack.includes(q)
      return matchesCategory && matchesQuery
    })
  }, [qParam, catParam])

  const activeCategoryLabel =
    catParam.toLowerCase() === 'all'
      ? 'All'
      : categories.find((c) => c.toLowerCase() === catParam.toLowerCase()) ??
        'All'

  const [activeProductId, setActiveProductId] = useState(null)
  const activeProduct = useMemo(
    () => PRODUCTS.find((p) => p.id === activeProductId) ?? null,
    [activeProductId]
  )

  return (
    <MotionSection
      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass rounded-3xl p-6 md:p-10"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="text-left">
            <div className="text-sm font-medium tracking-tight text-zinc-700">
              Shop
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
              Premium casual wear
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
              Search and filter across tees, hoodies, jackets, pants, and
              accessories.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:items-end">
            <div className="glass flex items-center gap-2 rounded-full px-4 py-2 shadow-none">
              <Search className="h-4 w-4 text-zinc-600" />
              <input
                value={searchValue}
                onChange={(e) => {
                  const next = e.target.value
                  setSearchValue(next)
                  const nextParams = new URLSearchParams(params)
                  if (next.trim()) nextParams.set('q', next.trim())
                  else nextParams.delete('q')
                  setParams(nextParams, { replace: true })
                }}
                placeholder="Search products"
                className="w-full bg-transparent text-sm text-zinc-800 placeholder:text-zinc-500 focus:outline-none md:w-64"
              />
              {qParam ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue('')
                    const nextParams = new URLSearchParams(params)
                    nextParams.delete('q')
                    setParams(nextParams, { replace: true })
                  }}
                  className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-black/10"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="text-left text-xs font-medium text-zinc-600 md:text-right">
              {filtered.length} item{filtered.length === 1 ? '' : 's'} ·{' '}
              {activeCategoryLabel}
            </div>
          </div>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-wrap items-center gap-2"
        >
          {categories.map((c) => {
            const key = c.toLowerCase()
            const active = key === catParam.toLowerCase()
            return (
              <CategoryPill
                key={c}
                label={c}
                active={active}
                onClick={() => {
                  const nextParams = new URLSearchParams(params)
                  if (key === 'all') nextParams.set('cat', 'all')
                  else nextParams.set('cat', key)
                  setParams(nextParams, { replace: true })
                }}
              />
            )
          })}
        </MotionDiv>

        <MotionDiv
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.04 } },
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
                },
              }}
            >
              <ProductCard
                product={p}
                onView={(product) => setActiveProductId(product.id)}
              />
            </motion.div>
          ))}
        </MotionDiv>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-center text-sm text-zinc-700 backdrop-blur-2xl">
            No results. Try a different search or category.
          </div>
        ) : null}
      </div>

      <ProductQuickViewModal
        product={activeProduct}
        open={Boolean(activeProduct)}
        onClose={() => setActiveProductId(null)}
      />
    </MotionSection>
  )
}

function AboutPage() {
  const MotionSection = motion.section
  const MotionDiv = motion.div

  const values = useMemo(
    () => [
      {
        title: 'Craft-first basics',
        description:
          'Premium fabrics and clean construction designed to hold shape.',
        Icon: BadgeCheck,
      },
      {
        title: 'Inclusive by default',
        description:
          'Fits and silhouettes made for confidence across bodies and styles.',
        Icon: Sparkles,
      },
      {
        title: 'Built to last',
        description:
          'Timeless palettes, repeatable layering, and quality you can feel.',
        Icon: Leaf,
      },
    ],
    []
  )

  const testimonials = useMemo(
    () => [
      {
        name: 'Alyssa M.',
        detail: 'BOU Classic Tee',
        quote:
          'The fit is perfect and the fabric feels premium. Easy to dress up or down.',
      },
      {
        name: 'Jordan K.',
        detail: 'Liquid Glass Hoodie',
        quote:
          'Soft, structured, and clean. The details make it feel way more expensive.',
      },
      {
        name: 'Sam R.',
        detail: 'Relaxed Utility Pant',
        quote:
          'Comfort all day without looking sloppy. This is the silhouette I’ve been looking for.',
      },
    ],
    []
  )

  return (
    <div className="space-y-10">
      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass rounded-3xl p-6 md:p-10"
      >
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="text-sm font-medium tracking-tight text-zinc-700">
              About
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Designed for the best of everyday.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-700">
              Best Of Us is a modern essentials label focused on clean lines,
              premium comfort, and pieces that layer effortlessly. Our goal is
              simple: build a wardrobe that looks sharp, feels soft, and lasts.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Shop the essentials
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
              >
                View collections
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 backdrop-blur-2xl md:col-span-5 md:justify-self-end">
              <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-black/5 blur-3xl" />
                <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.70),transparent_45%),radial-gradient(circle_at_85%_40%,rgba(24,24,27,0.06),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.55),rgba(255,255,255,0.35))]" />
              </div>

              <div className="relative grid grid-cols-2 gap-px bg-black/10 p-px">
                <div className="bg-white/60 p-4 backdrop-blur-2xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/65 text-zinc-900 backdrop-blur-2xl">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-600">
                        Materials
                      </div>
                      <div className="mt-1 truncate text-base font-semibold text-zinc-950">
                        Premium
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-4 backdrop-blur-2xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/65 text-zinc-900 backdrop-blur-2xl">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-600">
                        Fit
                      </div>
                      <div className="mt-1 truncate text-base font-semibold text-zinc-950">
                        Inclusive
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-4 backdrop-blur-2xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/65 text-zinc-900 backdrop-blur-2xl">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-600">
                        Design
                      </div>
                      <div className="mt-1 truncate text-base font-semibold text-zinc-950">
                        Minimal
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 p-4 backdrop-blur-2xl">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/65 text-zinc-900 backdrop-blur-2xl">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-600">
                        Vibe
                      </div>
                      <div className="mt-1 truncate text-base font-semibold text-zinc-950">
                        Confident
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </MotionSection>

      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid gap-4 md:grid-cols-12"
      >
        <div className="glass rounded-3xl p-6 md:col-span-7 md:p-8">
          <div className="text-sm font-semibold tracking-tight text-zinc-950">
            Our story
          </div>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700">
            We started with one idea: essentials should feel elevated without
            trying too hard. That means fewer loud graphics and more attention
            to fabric weight, drape, stitching, and fit.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700">
            The result is a collection of core pieces you reach for every day —
            designed to mix, match, and move with you.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {['Soft hand-feel', 'Clean silhouettes', 'Everyday layering'].map(
              (label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-semibold text-zinc-900 backdrop-blur-2xl"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-3xl p-6 md:col-span-5 md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.06),transparent_45%),radial-gradient(circle_at_85%_40%,rgba(0,0,0,0.05),transparent_50%),linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.45))]" />
          </div>

          <div className="relative">
            <div className="text-sm font-semibold tracking-tight text-zinc-950">
              Design language
            </div>
            <div className="mt-3 rounded-3xl border border-black/10 bg-white/45 p-4 backdrop-blur-2xl">
              <div className="text-xs font-medium text-zinc-600">
                Inspired by Liquid Glass
              </div>
              <div className="mt-2 text-sm font-semibold text-zinc-950">
                Frosted layers, soft light, precision.
              </div>
              <div className="mt-3 h-px w-full bg-black/10" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-white/35 shadow-[0_0_0_1px_rgba(0,0,0,0.06)_inset]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass rounded-3xl p-6 md:p-10"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-sm font-semibold tracking-tight text-zinc-950">
              What we stand for
            </div>
            <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
              Thoughtful essentials built around quality, comfort, and an
              effortless look that stays sharp.
            </div>
          </div>
        </div>

        <MotionDiv
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          {values.map((v) => (
            <motion.div
              key={v.title}
              variants={{
                hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
                },
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 p-5 backdrop-blur-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl">
                  <v.Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-950">
                    {v.title}
                  </div>
                  <div className="mt-1 text-sm leading-relaxed text-zinc-700">
                    {v.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </MotionDiv>
      </MotionSection>

      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass rounded-3xl p-6 md:p-10"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-sm font-semibold tracking-tight text-zinc-950">
              What customers say
            </div>
            <div className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
              Real feedback from people building their everyday uniform.
            </div>
          </div>
          <Link
            to="/shop"
            className="rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
          >
            Shop now
          </Link>
        </div>

        <MotionDiv
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={{
                hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
                },
              }}
              className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 p-5 backdrop-blur-2xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.06),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.40))]" />
              <div className="relative">
                <div className="text-sm font-semibold text-zinc-950">
                  {t.name}
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-600">
                  Verified · {t.detail}
                </div>
                <div className="mt-3 text-sm leading-relaxed text-zinc-800">
                  “{t.quote}”
                </div>
              </div>
            </motion.div>
          ))}
        </MotionDiv>
      </MotionSection>
    </div>
  )
}

function CollectionsPage() {
  const MotionSection = motion.section
  const MotionDiv = motion.div

  const counts = useMemo(() => {
    const byCategory = PRODUCTS.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1
      return acc
    }, {})
    const byBadge = PRODUCTS.reduce((acc, p) => {
      acc[p.badge] = (acc[p.badge] ?? 0) + 1
      return acc
    }, {})
    return { byCategory, byBadge, total: PRODUCTS.length }
  }, [])

  const collections = useMemo(
    () => [
      {
        title: 'New Arrivals',
        subtitle: 'Fresh silhouettes and seasonal essentials.',
        to: '/shop?q=new',
        count: counts.byBadge.New ?? 0,
        gradient:
          'bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.80),transparent_45%),radial-gradient(circle_at_90%_35%,rgba(24,24,27,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.38))]',
      },
      {
        title: 'Best Sellers',
        subtitle: 'The pieces people reorder, restyle, and repeat.',
        to: '/shop?q=best',
        count: counts.byBadge['Best Seller'] ?? 0,
        gradient:
          'bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_75%_70%,rgba(24,24,27,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.36))]',
      },
      {
        title: 'Tees',
        subtitle: 'Clean fits with a premium hand-feel.',
        to: '/shop?cat=tees',
        count: counts.byCategory.Tees ?? 0,
        gradient:
          'bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(24,24,27,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.36))]',
      },
      {
        title: 'Hoodies',
        subtitle: 'Soft structure, elevated comfort.',
        to: '/shop?cat=hoodies',
        count: counts.byCategory.Hoodies ?? 0,
        gradient:
          'bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_30%_80%,rgba(24,24,27,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.36))]',
      },
      {
        title: 'Outerwear',
        subtitle: 'Minimal layers made to move.',
        to: '/shop?cat=jackets',
        count: counts.byCategory.Jackets ?? 0,
        gradient:
          'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_90%_70%,rgba(24,24,27,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.36))]',
      },
      {
        title: 'Accessories',
        subtitle: 'Small details, big impact.',
        to: '/shop?cat=accessories',
        count: counts.byCategory.Accessories ?? 0,
        gradient:
          'bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.78),transparent_45%),radial-gradient(circle_at_70%_75%,rgba(24,24,27,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.36))]',
      },
    ],
    [counts]
  )

  return (
    <div className="space-y-10">
      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass rounded-3xl p-6 md:p-10"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="text-left">
              <div className="text-sm font-medium tracking-tight text-zinc-700">
                Collections
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
                Curated edits
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
                A few clean entry points into the wardrobe — built for layering,
                mixing, and repeating.
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white/55 px-4 py-3 text-left text-sm font-semibold text-zinc-950 backdrop-blur-2xl md:text-right">
              {counts.total} pieces · Premium basics
            </div>
          </div>

          <MotionDiv
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {collections.map((c) => (
              <motion.div
                key={c.title}
                variants={{
                  hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
                  },
                }}
              >
                <Link
                  to={c.to}
                  className="group relative block overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-glass backdrop-blur-2xl transition hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 ${c.gradient}`} />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_45%,rgba(0,0,0,0.06))]" />

                  <div className="relative p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold tracking-tight text-zinc-950">
                          {c.title}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-zinc-700">
                          {c.subtitle}
                        </div>
                      </div>
                      <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-semibold text-zinc-900 whitespace-nowrap backdrop-blur-2xl">
                        <span className="tabular-nums">{c.count}</span>
                        <span>item{c.count === 1 ? '' : 's'}</span>
                      </div>
                    </div>

                    <div className="mt-4 inline-flex items-center rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition group-hover:bg-black/10">
                      Shop this edit
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>
    </div>
  )
}

function JournalPostModal({ open, post, onClose }) {
  const MotionDiv = motion.div
  const MotionArticle = motion.article
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return open && post
    ? createPortal(
        <AnimatePresence>
          <MotionDiv
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close article"
              onClick={onClose}
              className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            />

            <MotionArticle
              initial={{ y: 14, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 14, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute left-1/2 top-1/2 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-white/65 shadow-glass backdrop-blur-2xl"
              role="dialog"
              aria-modal="true"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.85),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(24,24,27,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.42))]" />

              <div className="relative max-h-[min(78vh,780px)] overflow-y-auto">
                <div className="flex items-start justify-between gap-3 border-b border-black/10 px-5 py-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-700">
                      {post.category} · {post.date}
                    </div>
                    <div className="mt-1 truncate text-lg font-semibold tracking-tight text-zinc-950">
                      {post.title}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="px-5 py-5">
                  <div className="rounded-3xl border border-black/10 bg-white/55 p-4 text-sm text-zinc-700 backdrop-blur-2xl">
                    {post.excerpt}
                  </div>

                  <div className="mt-5 grid gap-4 text-sm leading-relaxed text-zinc-800">
                    {post.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                    <div className="text-xs font-medium text-zinc-600">
                      {post.readTime} · Built for the Best Of Us journal
                    </div>
                    <Link
                      to="/shop"
                      onClick={onClose}
                      className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900"
                    >
                      Shop the look
                    </Link>
                  </div>
                </div>
              </div>
            </MotionArticle>
          </MotionDiv>
        </AnimatePresence>,
        document.body
      )
    : null
}

function JournalPage() {
  const MotionSection = motion.section
  const MotionDiv = motion.div

  const posts = useMemo(
    () => [
      {
        slug: 'the-uniform',
        category: 'Style',
        date: 'March 2026',
        readTime: '3 min read',
        title: 'The everyday uniform',
        excerpt:
          'A minimal wardrobe isn’t about having less. It’s about having fewer, better pieces that you can trust.',
        body: [
          'Start with silhouettes you reach for repeatedly: a tee with clean drape, a hoodie that holds shape, and a pant that moves without looking relaxed.',
          'Then build contrast through texture instead of graphics. Weight, stitch, and finish do the talking.',
          'When your essentials are consistent, getting dressed becomes automatic — and you still look intentional.',
        ],
      },
      {
        slug: 'fabric-first',
        category: 'Materials',
        date: 'March 2026',
        readTime: '4 min read',
        title: 'Fabric first, always',
        excerpt:
          'The fastest way to upgrade a fit is to upgrade the fabric. Here’s what we look for when choosing everyday basics.',
        body: [
          'A premium hand-feel should stay premium after the wash. That means looking at fiber content, weight, and how the knit is finished.',
          'Structure matters. Even a soft piece should return to form — especially at the collar, cuffs, and hem.',
          'Finally, comfort isn’t just softness. Breathability and drape are what make a piece feel wearable all day.',
        ],
      },
      {
        slug: 'layering-light',
        category: 'Guides',
        date: 'March 2026',
        readTime: '3 min read',
        title: 'Layering, the clean way',
        excerpt:
          'Keep it simple: one base, one mid, one outer. The best layering looks effortless because it is.',
        body: [
          'Choose a base that fits close without pulling. Your mid layer adds dimension — texture, weight, or a zip.',
          'Outerwear is about proportion. A minimal jacket instantly sharpens relaxed fits.',
          'Stick to a tight palette so the silhouette carries the look. Let the materials create the depth.',
        ],
      },
    ],
    []
  )

  const [activeSlug, setActiveSlug] = useState(null)
  const activePost = useMemo(
    () => posts.find((p) => p.slug === activeSlug) ?? null,
    [posts, activeSlug]
  )

  return (
    <div className="space-y-10">
      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass rounded-3xl p-6 md:p-10"
      >
        <div className="flex flex-col gap-6">
          <div className="text-left">
            <div className="text-sm font-medium tracking-tight text-zinc-700">
              Journal
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 md:text-3xl">
              Editorial notes
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-700">
              Short reads on fit, fabric, and building an everyday uniform.
            </p>
          </div>

          <MotionDiv
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
            className="grid gap-4 md:grid-cols-3"
          >
            {posts.map((p) => (
              <motion.button
                key={p.slug}
                type="button"
                onClick={() => setActiveSlug(p.slug)}
                variants={{
                  hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
                  },
                }}
                className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 p-5 text-left shadow-glass backdrop-blur-2xl transition hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.78),transparent_50%),linear-gradient(to_bottom,rgba(255,255,255,0.62),rgba(255,255,255,0.36))]" />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-700">
                    <span className="rounded-full border border-black/10 bg-white/60 px-2.5 py-1 backdrop-blur-2xl">
                      {p.category}
                    </span>
                    <span className="text-zinc-600">{p.date}</span>
                  </div>
                  <div className="mt-3 text-sm font-semibold tracking-tight text-zinc-950">
                    {p.title}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-zinc-700">
                    {p.excerpt}
                  </div>
                  <div className="mt-4 inline-flex items-center rounded-full bg-black/5 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition group-hover:bg-black/10">
                    Read · {p.readTime}
                  </div>
                </div>
              </motion.button>
            ))}
          </MotionDiv>
        </div>
      </MotionSection>

      <JournalPostModal
        open={Boolean(activePost)}
        post={activePost}
        onClose={() => setActiveSlug(null)}
      />
    </div>
  )
}

function CheckoutSuccessPage() {
  const MotionSection = motion.section
  const MotionDiv = motion.div
  const order = useMemo(() => readLastOrder(), [])
  const orderId =
    order && typeof order.orderId === 'string' ? order.orderId : createOrderId()
  const itemCount =
    order && typeof order.itemCount === 'number' && Number.isFinite(order.itemCount)
      ? Math.max(0, Math.floor(order.itemCount))
      : 0
  const subtotal =
    order && typeof order.subtotal === 'number' && Number.isFinite(order.subtotal)
      ? Math.max(0, order.subtotal)
      : 0

  return (
    <div className="space-y-10">
      <MotionSection
        initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="glass relative overflow-hidden rounded-3xl p-6 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
          <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.80),transparent_45%),radial-gradient(circle_at_90%_25%,rgba(24,24,27,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.42))]" />
        </div>

        <div className="relative grid gap-6 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-semibold text-zinc-900 backdrop-blur-2xl">
              <BadgeCheck className="h-4 w-4" />
              Order confirmed
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
              Thank you for your order.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-700">
              This is a simulated checkout flow for the demo. No payment was
              processed and no shipping details were collected.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-900"
              >
                Continue shopping
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/60 px-5 py-2.5 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
              >
                Back home
              </Link>
            </div>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 p-5 backdrop-blur-2xl md:col-span-5"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.75),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.60),rgba(255,255,255,0.38))]" />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-zinc-950">
                  Order summary
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-700">Order</div>
                  <div className="font-semibold text-zinc-950">{orderId}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-700">Items</div>
                  <div className="font-semibold text-zinc-950">{itemCount}</div>
                </div>
                <div className="h-px w-full bg-black/10" />
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-700">Subtotal</div>
                  <div className="font-semibold text-zinc-950">
                    {formatPrice(subtotal)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-700">Shipping</div>
                  <div className="font-semibold text-zinc-950">
                    {subtotal >= 75 ? 'Free' : formatPrice(6)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-zinc-700">Total</div>
                  <div className="font-semibold text-zinc-950">
                    {formatPrice(subtotal + (subtotal >= 75 ? 0 : 6))}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs font-medium text-zinc-600">
                Confirmation details are stored only in your browser session.
              </div>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const isCartRoute = location.pathname === '/cart'
  const cartOpen = isCartOpen || isCartRoute

  const closeCart = () => {
    setIsCartOpen(false)
    if (!isCartRoute) return
    const canGoBack =
      typeof window !== 'undefined' && Number(window.history.length) > 1
    if (canGoBack) navigate(-1)
    else navigate('/shop', { replace: true })
  }

  const checkout = () => {
    const items = readCartItems()
    const itemCount = items.reduce(
      (sum, i) => sum + (Number(i.quantity) || 0),
      0
    )
    const subtotal = items.reduce((sum, i) => {
      const product = PRODUCTS.find((p) => p.id === i.productId)
      if (!product) return sum
      return sum + product.price * (Number(i.quantity) || 0)
    }, 0)
    writeLastOrder({
      orderId: createOrderId(),
      itemCount,
      subtotal,
      placedAt: Date.now(),
    })
    clearCart()
    setIsCartOpen(false)
    navigate('/checkout/success', { replace: true })
  }

  return (
    <div className="min-h-dvh">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,rgba(11,61,46,0.65),transparent_55%),radial-gradient(circle_at_85%_10%,rgba(0,0,0,0.85),transparent_60%),radial-gradient(circle_at_20%_90%,rgba(11,61,46,0.35),transparent_55%),linear-gradient(to_bottom,rgba(5,6,7,1),rgba(11,61,46,0.55)_45%,rgba(5,6,7,1))]" />
      <ScrollToTop />

      <Navbar onCartOpen={() => setIsCartOpen(true)} />

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <div className="space-y-10">
                  <HeroSection />
                  <FeaturedCollections />
                  <div className="hidden">
                    <PlaceholderRow />
                  </div>
                </div>
              }
            />
            <Route
              path="/shop"
              element={<ShopPage />}
            />
            <Route
              path="/collections"
              element={<CollectionsPage />}
            />
            <Route
              path="/about"
              element={<AboutPage />}
            />
            <Route
              path="/journal"
              element={<JournalPage />}
            />
            <Route
              path="/cart"
              element={
                <Page
                  title="Cart"
                  subtitle="Your cart opens as a sidebar."
                />
              }
            />
            <Route
              path="/checkout/success"
              element={<CheckoutSuccessPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />

      <CartSidebarModal
        open={cartOpen}
        onCheckout={checkout}
        onClose={closeCart}
      />
    </div>
  )
}
