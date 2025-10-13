'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Brand } from '@/lib/database.types';
import { formatPrice } from '@/lib/format';

interface FilterSidebarProps {
  brands: Brand[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  inStock: boolean;
  outOfStock: boolean;
  selectedBrands: string[];
  priceRange: [number, number];
}

export function FilterSidebar({ brands, onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    inStock: false,
    outOfStock: false,
    selectedBrands: [],
    priceRange: [0, 50000000],
  });

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleBrand = (brandId: string) => {
    const newBrands = filters.selectedBrands.includes(brandId)
      ? filters.selectedBrands.filter(id => id !== brandId)
      : [...filters.selectedBrands, brandId];
    updateFilters({ selectedBrands: newBrands });
  };

  return (
    <div className="w-[260px] flex-shrink-0 sticky top-24 h-fit">
      <Accordion type="multiple" defaultValue={['availability', 'brand', 'price']} className="w-full">
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-caps">
            Availability
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  updateFilters({ inStock: checked as boolean })
                }
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="out-of-stock"
                checked={filters.outOfStock}
                onCheckedChange={(checked) =>
                  updateFilters({ outOfStock: checked as boolean })
                }
              />
              <Label htmlFor="out-of-stock" className="text-sm cursor-pointer">
                Out of Stock
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-caps">
            Brand
          </AccordionTrigger>
          <AccordionContent className="space-y-3 max-h-[300px] overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.selectedBrands.includes(brand.id)}
                  onCheckedChange={() => toggleBrand(brand.id)}
                />
                <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                  {brand.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-caps">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Slider
              min={0}
              max={50000000}
              step={500000}
              value={filters.priceRange}
              onValueChange={(value) =>
                updateFilters({ priceRange: value as [number, number] })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
