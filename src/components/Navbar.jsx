import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

const CART_STORAGE_KEY = 'bou_cart'

function getCartCount() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return 0
    const items = JSON.parse(raw)
    if (!Array.isArray(items)) return 0
    return items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0)
  } catch {
    return 0
  }
}

function navLinkClassName({ isActive }) {
  return [
    'rounded-full px-3 py-1.5 text-sm font-medium transition',
    'hover:bg-black/5',
    isActive ? 'bg-black/5 text-zinc-950' : 'text-zinc-700',
  ].join(' ')
}

export default function Navbar({ onCartOpen }) {
  const MotionHeader = motion.header
  const MotionDiv = motion.div
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const previousPathnameRef = useRef(location.pathname)
  const [cartCount, setCartCount] = useState(() =>
    typeof window === 'undefined' ? 0 : getCartCount(),
  )

  const links = useMemo(
    () => [
      { to: '/shop', label: 'Shop' },
      { to: '/collections', label: 'Collections' },
      { to: '/about', label: 'About' },
      { to: '/journal', label: 'Journal' },
    ],
    [],
  )

  useEffect(() => {
    const previousPathname = previousPathnameRef.current
    previousPathnameRef.current = location.pathname
    if (!isMenuOpen) return
    if (previousPathname === location.pathname) return
    const t = setTimeout(() => setIsMenuOpen(false), 0)
    return () => clearTimeout(t)
  }, [isMenuOpen, location.pathname])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  useEffect(() => {
    const sync = () => setCartCount(getCartCount())
    sync()

    window.addEventListener('storage', sync)
    window.addEventListener('bou_cart_updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('bou_cart_updated', sync)
    }
  }, [])

  const openCart = () => {
    setIsMenuOpen(false)
    if (typeof onCartOpen === 'function') {
      onCartOpen()
      return
    }
    navigate('/cart')
  }

  return (
    <MotionHeader
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      className="tap-highlight fixed inset-x-0 top-0 z-50"
    >
      <AnimatePresence>
        {isMenuOpen ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[2px] md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="relative z-50 mx-auto w-full max-w-6xl px-4 pt-3">
        <div className="glass rounded-3xl">
          <div className="flex items-center gap-3 px-4 py-3 md:px-5">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-semibold tracking-tight text-zinc-950"
            >
              <span className="relative">
                Best Of Us
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-zinc-950/30 transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClassName}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={openCart}
                className="glass group relative flex h-10 w-10 items-center justify-center rounded-full shadow-none transition hover:bg-white/65"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5 text-zinc-800" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-zinc-950 px-1 text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsMenuOpen((v) => !v)}
                className="glass grid h-10 w-10 place-items-center rounded-full shadow-none transition hover:bg-white/65 md:hidden"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-zinc-800" />
                ) : (
                  <Menu className="h-5 w-5 text-zinc-800" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen ? (
              <MotionDiv
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                className="overflow-hidden md:hidden"
              >
                <div className="px-4 pb-4">
                  <div className="glass rounded-2xl p-2 shadow-none">
                    <div className="grid gap-1">
                      {links.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            [
                              'rounded-xl px-3 py-2 text-sm font-medium transition',
                              isActive
                                ? 'bg-black/5 text-zinc-950'
                                : 'text-zinc-700 hover:bg-black/5',
                            ].join(' ')
                          }
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </MotionDiv>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </MotionHeader>
  )
}

