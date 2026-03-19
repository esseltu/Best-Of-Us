import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const collections = [
  {
    title: 'New Arrivals',
    subtitle: 'Fresh drops, clean silhouettes.',
    badge: 'New',
    to: '/shop',
    gradient:
      'bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.14),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.10),transparent_50%),linear-gradient(to_bottom,rgba(255,255,255,0.70),rgba(255,255,255,0.40))]',
  },
  {
    title: 'Core Tees',
    subtitle: 'Premium cotton. Everyday confidence.',
    badge: 'Essentials',
    to: '/shop',
    gradient:
      'bg-[radial-gradient(circle_at_25%_25%,rgba(0,0,0,0.10),transparent_55%),radial-gradient(circle_at_85%_30%,rgba(0,0,0,0.08),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(255,255,255,0.42))]',
  },
  {
    title: 'Outerwear',
    subtitle: 'Layer up with glass-smooth edge.',
    badge: 'Featured',
    to: '/shop',
    gradient:
      'bg-[radial-gradient(circle_at_30%_10%,rgba(0,0,0,0.12),transparent_50%),radial-gradient(circle_at_70%_85%,rgba(0,0,0,0.10),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.70),rgba(255,255,255,0.40))]',
  },
]

export default function FeaturedCollections() {
  const MotionSection = motion.section
  const MotionDiv = motion.div

  return (
    <MotionSection
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative"
    >
      <div className="glass rounded-3xl p-6 md:p-10">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <div className="text-sm font-medium tracking-tight text-zinc-700">
              Featured Collections
            </div>
            <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
              Curated for the best of you.
            </div>
          </div>

          <Link
            to="/collections"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm font-semibold text-zinc-900 backdrop-blur-2xl transition hover:bg-white/75"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <MotionDiv
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          {collections.map((c) => (
            <MotionDiv
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 12, filter: 'blur(8px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] },
                },
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 shadow-glass backdrop-blur-2xl"
            >
              <div className={`absolute inset-0 ${c.gradient}`} />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),transparent_35%,rgba(0,0,0,0.06))]" />

              <div className="relative flex min-h-56 flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-2xl">
                    {c.badge}
                  </span>
                  <div className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/60 text-zinc-900 backdrop-blur-2xl transition group-hover:bg-white/75">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-lg font-semibold tracking-tight text-zinc-950">
                    {c.title}
                  </div>
                  <div className="mt-1 text-sm text-zinc-700">
                    {c.subtitle}
                  </div>

                  <div className="mt-4">
                    <Link
                      to={c.to}
                      className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </MotionSection>
  )
}

