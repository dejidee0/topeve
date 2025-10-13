'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Brand } from '@/lib/database.types';
import { FilterSidebar, FilterState } from '@/components/filter-sidebar';
import { ProductGrid } from '@/components/product-grid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [sortBy, setSortBy] = useState('date-desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, brandsRes] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            brand:brands(*),
            images:product_images(*)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
        supabase.from('brands').select('*').order('name'),
      ]);

      if (productsRes.data) setProducts(productsRes.data as Product[]);
      if (brandsRes.data) setBrands(brandsRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...products];

    if (filters.inStock && !filters.outOfStock) {
      filtered = filtered.filter(p => p.in_stock);
    } else if (filters.outOfStock && !filters.inStock) {
      filtered = filtered.filter(p => !p.in_stock);
    }

    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(p =>
        p.brand_id && filters.selectedBrands.includes(p.brand_id)
      );
    }

    filtered = filtered.filter(p =>
      p.price_cents >= filters.priceRange[0] &&
      p.price_cents <= filters.priceRange[1]
    );

    setFilteredProducts(filtered);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredProducts];

    switch (value) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price_cents - a.price_cents);
        break;
    }

    setFilteredProducts(sorted);
  };

  if (loading) {
    return (
      <div className="container py-24">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-h1 uppercase tracking-caps mb-2">All Products</h1>
        <div className="w-16 h-0.5 bg-accent"></div>
      </div>

      <div className="flex gap-12">
        <FilterSidebar brands={brands} onFilterChange={handleFilterChange} />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm text-muted">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date: New to Old</SelectItem>
                <SelectItem value="date-asc">Date: Old to New</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={3} />
          ) : (
            <div className="text-center py-16">
              <p className="text-muted">No products match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
