import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/database.types";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { formatDate, getReadingTime } from "@/lib/format";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
async function getNewArrivals(): Promise<Product[]> {
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      brand:brands(*),
      images:product_images(*)
    `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  return (products || []) as Product[];
}

async function getBlogPosts() {
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(3);

  return (data || []) as any[];
}

const categoryTiles = [
  {
    name: "Dresses",
    href: "/shop?category=dresses",
    image:
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Bubus & Agbadas",
    href: "/shop?category=bubus",
    image:
      "https://images.pexels.com/photos/3394658/pexels-photo-3394658.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Two Piece Sets",
    href: "/shop?category=two-piece",
    image:
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Tops & Blouses",
    href: "/shop?category=tops",
    image:
      "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Bottoms",
    href: "/shop?category=bottoms",
    image:
      "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Jumpsuits",
    href: "/shop?category=jumpsuits",
    image:
      "https://images.pexels.com/photos/1721558/pexels-photo-1721558.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Accessories",
    href: "/accessories",
    image:
      "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    name: "Menswear",
    href: "/ready-to-wear/men",
    image:
      "https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default async function HomePage() {
  const newArrivals = await getNewArrivals();
  const blogPosts = await getBlogPosts();

  return (
    <div>
      <section className="relative h-[70vh] lg:h-[85vh]">
        <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-4 gap-1">
          <div className="relative col-span-1">
            <Image
              src="/hero/1.jpg"
              alt="African fashion editorial"
              fill
              className="object-cover"
              sizes="25vw"
              priority
            />
          </div>
          <div className="relative col-span-1 lg:col-span-2">
            <Image
              src="/hero/2.jpg"
              alt="African fashion editorial"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white">
              <h1 className="font-display text-4xl lg:text-6xl font-bold tracking-tightest text-center mb-4">
                Elegance Redefined
              </h1>
              <p className="text-lg lg:text-xl mb-6 text-center max-w-md">
                Discover our curated collection of premium African fashion
              </p>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps"
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          </div>
          <div className="relative col-span-2 lg:col-span-1">
            <Image
              src="/hero/3.jpg"
              alt="African fashion editorial"
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-h1 uppercase tracking-caps mb-2">
            New Arrivals
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto"></div>
        </div>
        <ProductGrid products={newArrivals} columns={4} />
        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="uppercase tracking-caps border-fg hover:bg-fg hover:text-bg"
          >
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </section>

      <section className="container py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-12">
          <div className="relative aspect-[3/4] mb-8 lg:mb-0">
            <Image
              src="https://images.pexels.com/photos/1405963/pexels-photo-1405963.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Explore your style"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="font-display text-h1 lg:text-[52px] lg:leading-[60px] tracking-tightest">
              Explore Your Style
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              From traditional ceremonies to contemporary gatherings, our
              collection celebrates the richness of African heritage with modern
              sophistication. Each piece is carefully selected to ensure you
              make a statement wherever you go.
            </p>
            <div>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent-600 text-bg uppercase tracking-caps"
              >
                <Link href="/shop">Shop My Selects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-h1 uppercase tracking-caps mb-2">
            Shop By Category
          </h2>
          <div className="w-16 h-0.5 bg-accent mx-auto"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categoryTiles.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-end p-4">
                <h3 className="font-display text-white text-xl lg:text-2xl tracking-tightest">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {blogPosts.length > 0 && (
        <section className="container py-16 lg:py-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-h1 uppercase tracking-caps mb-2">
              From The Journal
            </h2>
            <div className="w-16 h-0.5 bg-accent mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/2] mb-4 overflow-hidden">
                  <Image
                    src={post.hero_url || "/placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-caps">
                    <span>{formatDate(post.published_at)}</span>
                    <span>•</span>
                    <span>{getReadingTime(post.excerpt)} min read</span>
                  </div>
                  <h3 className="font-display text-xl group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="text-sm text-accent uppercase tracking-caps">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
