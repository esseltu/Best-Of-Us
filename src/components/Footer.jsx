import { motion } from 'framer-motion'
import { Instagram, Twitter, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const groups = [
  {
    title: 'Explore',
    links: [
      { label: 'Shop', to: '/shop' },
      { label: 'Collections', to: '/collections' },
      { label: 'Journal', to: '/journal' },
    ],
  },
  {
    title: 'Brand',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Sustainability', to: '/about' },
      { label: 'Contact', to: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping', to: '/about' },
      { label: 'Returns', to: '/about' },
      { label: 'Size Guide', to: '/about' },
    ],
  },
]

export default function Footer() {
  const MotionDiv = motion.div
  return (
    <footer className="pb-6 pt-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="glass rounded-3xl p-6 md:p-10"
        >
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="text-left">
                <div className="text-sm font-semibold tracking-tight text-zinc-950">
                  Best Of Us
                </div>
                <div className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-700">
                  Premium casual wear with a confident, inclusive, high-quality
                  lifestyle vibe.
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <a
                    className="glass grid h-10 w-10 place-items-center rounded-full shadow-none transition hover:bg-white/65"
                    href="#"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 text-zinc-800" />
                  </a>
                  <a
                    className="glass grid h-10 w-10 place-items-center rounded-full shadow-none transition hover:bg-white/65"
                    href="#"
                    aria-label="Twitter/X"
                  >
                    <Twitter className="h-5 w-5 text-zinc-800" />
                  </a>
                  <a
                    className="glass grid h-10 w-10 place-items-center rounded-full shadow-none transition hover:bg-white/65"
                    href="#"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5 text-zinc-800" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3 md:col-span-7">
              {groups.map((group) => (
                <div key={group.title} className="text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    {group.title}
                  </div>
                  <div className="mt-3 grid gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        className="w-fit text-sm text-zinc-700 transition hover:text-zinc-950"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-6 text-left text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} Best Of Us. All rights reserved.</div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link to="/about" className="transition hover:text-zinc-950">
                Privacy Policy
              </Link>
              <Link to="/about" className="transition hover:text-zinc-950">
                Terms
              </Link>
              <Link to="/about" className="transition hover:text-zinc-950">
                Customer Service
              </Link>
            </div>
          </div>
        </MotionDiv>
      </div>
    </footer>
  )
}
