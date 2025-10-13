import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div>
      <section className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative aspect-[3/4]">
            <Image
              src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="About TopeveCreation"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <h1 className="font-display text-h1 lg:text-[56px] lg:leading-[64px] tracking-tightest">
              Our Story
            </h1>

            <div className="space-y-4 text-lg text-muted leading-relaxed">
              <p>
                TopeveCreation was born from a deep appreciation for African craftsmanship and a
                vision to bring the continent&apos;s finest fashion to the world. We curate each piece
                with meticulous attention to quality, authenticity, and cultural significance.
              </p>

              <p>
                Our collection celebrates the diversity of African design — from traditional aso oke
                and ankara prints to contemporary interpretations that honor heritage while embracing
                modern aesthetics. Every garment tells a story of skilled artisans, time-honored
                techniques, and the vibrant spirit of African creativity.
              </p>
            </div>

            <div>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps"
              >
                <Link href="/shop">Shop Our Selects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-h2 uppercase tracking-caps mb-2">Our Values</h2>
            <div className="w-16 h-0.5 bg-accent mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-3">
              <h3 className="font-display text-h3 tracking-tightest">Authenticity</h3>
              <p className="text-muted">
                Every piece in our collection is carefully selected to ensure it represents genuine
                African craftsmanship and design heritage.
              </p>
            </div>

            <div className="text-center space-y-3">
              <h3 className="font-display text-h3 tracking-tightest">Quality</h3>
              <p className="text-muted">
                We partner only with skilled artisans and established brands who share our commitment
                to excellence and attention to detail.
              </p>
            </div>

            <div className="text-center space-y-3">
              <h3 className="font-display text-h3 tracking-tightest">Community</h3>
              <p className="text-muted">
                Supporting African designers and artisans is at the heart of what we do. Your purchase
                directly contributes to thriving creative communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-[3/2]">
            <Image
              src="https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Craftsmanship"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/20 flex items-end p-6">
              <h3 className="font-display text-white text-2xl tracking-tightest">
                Masterful Craftsmanship
              </h3>
            </div>
          </div>

          <div className="relative aspect-[3/2]">
            <Image
              src="https://images.pexels.com/photos/1405963/pexels-photo-1405963.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Cultural Heritage"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-black/20 flex items-end p-6">
              <h3 className="font-display text-white text-2xl tracking-tightest">
                Cultural Heritage
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
