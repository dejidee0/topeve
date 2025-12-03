import { createClient } from "@/supabase/client";

const supabase = createClient();

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Convert price from kobo to NGN
 */
export const koboToNGN = (kobo) => {
  return kobo / 100;
};

/**
 * Convert price from NGN to kobo
 */
export const ngnToKobo = (ngn) => {
  return ngn * 100;
};

export const fade = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

/**
 * Format price for display
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};
// =====================================================
// FETCH ALL PRODUCTS
// =====================================================

/**
 * Get all products (active only, not deleted)
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit number of results
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.orderBy - Field to order by (default: 'created_at')
 * @param {boolean} options.ascending - Sort order (default: false)
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getAllProducts(options = {}) {
  const {
    limit = null,
    offset = 0,
    orderBy = "created_at",
    ascending = false,
  } = options;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .eq("in_stock", true);

  // Apply ordering
  query = query.order(orderBy, { ascending });

  // Apply pagination
  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    // console.error("❌ Error fetching all products:", error);
    return { data: null, error, count: 0 };
  }

  console.log(`✅ Fetched ${data?.length} products (total: ${count})`);
  return { data, error: null, count };
}

// =====================================================
// FETCH SINGLE PRODUCT
// =====================================================

/**
 * Get product by ID
 * @param {string} id - Product UUID
 * @returns {Promise<{data: Object|null, error: any}>}
 */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error(`❌ Error fetching product ${id}:`, error);
    return { data: null, error };
  }

  console.log(`✅ Fetched product: ${data?.name}`);
  return { data, error: null };
}

/**
 * Get product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<{data: Object|null, error: any}>}
 */
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error(`❌ Error fetching product by slug ${slug}:`, error);
    return { data: null, error };
  }

  console.log(`✅ Fetched product: ${data?.name}`);

  // Increment view count
  await incrementProductViews(data.id);

  return { data, error: null };
}

/**
 * Get product by SKU
 * @param {string} sku - Product SKU
 * @returns {Promise<{data: Object|null, error: any}>}
 */
export async function getProductBySKU(sku) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error(`❌ Error fetching product by SKU ${sku}:`, error);
    return { data: null, error };
  }

  console.log(`✅ Fetched product: ${data?.name}`);
  return { data, error: null };
}

// =====================================================
// FETCH PRODUCTS BY CATEGORY
// =====================================================

/**
 * Get products by category
 * @param {string} category - Category name
 * @param {Object} options - Query options
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getProductsByCategory(category, options = {}) {
  const {
    limit = null,
    offset = 0,
    orderBy = "created_at",
    ascending = false,
  } = options;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category", category)
    .is("deleted_at", null)
    .eq("in_stock", true);

  query = query.order(orderBy, { ascending });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(`❌ Error fetching products by category ${category}:`, error);
    return { data: null, error, count: 0 };
  }

  console.log(`✅ Fetched ${data?.length} products in category: ${category}`);
  return { data, error: null, count };
}

/**
 * Get products by category and subcategory
 * @param {string} category - Category name
 * @param {string} subcategory - Subcategory name
 * @param {Object} options - Query options
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getProductsBySubcategory(
  category,
  subcategory,
  options = {}
) {
  const {
    limit = null,
    offset = 0,
    orderBy = "created_at",
    ascending = false,
  } = options;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category", category)
    .eq("subcategory", subcategory)
    .is("deleted_at", null)
    .eq("in_stock", true);

  query = query.order(orderBy, { ascending });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(
      `❌ Error fetching products by subcategory ${category}/${subcategory}:`,
      error
    );
    return { data: null, error, count: 0 };
  }

  console.log(
    `✅ Fetched ${data?.length} products in ${category}/${subcategory}`
  );
  return { data, error: null, count };
}

// =====================================================
// FETCH FEATURED PRODUCTS
// =====================================================

/**
 * Get featured products
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit number of results (default: 8)
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getFeaturedProducts(options = {}) {
  const { limit = 8, orderBy = "created_at", ascending = false } = options;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("featured", true)
    .is("deleted_at", null)
    .eq("in_stock", true);

  query = query.order(orderBy, { ascending });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("❌ Error fetching featured products:", error);
    return { data: null, error, count: 0 };
  }

  console.log(`✅ Fetched ${data?.length} featured products`);
  return { data, error: null, count };
}

// =====================================================
// FETCH PRODUCTS BY TAGS
// =====================================================

/**
 * Get products by tag
 * @param {string} tag - Tag to filter by
 * @param {Object} options - Query options
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getProductsByTag(tag, options = {}) {
  const {
    limit = null,
    offset = 0,
    orderBy = "created_at",
    ascending = false,
  } = options;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .contains("tags", [tag])
    .is("deleted_at", null)
    .eq("in_stock", true);

  query = query.order(orderBy, { ascending });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(`❌ Error fetching products by tag ${tag}:`, error);
    return { data: null, error, count: 0 };
  }

  console.log(`✅ Fetched ${data?.length} products with tag: ${tag}`);
  return { data, error: null, count };
}

// =====================================================
// FETCH NEW ARRIVALS
// =====================================================

/**
 * Get new arrival products (products with 'new' tag)
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit number of results (default: 12)
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getNewArrivals(options = {}) {
  const { limit = 12 } = options;
  return getProductsByTag("new", {
    limit,
    orderBy: "created_at",
    ascending: false,
  });
}

/**
 * Get best sellers (products with 'best-seller' tag)
 * @param {Object} options - Query options
 * @param {number} options.limit - Limit number of results (default: 12)
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function getBestSellers(options = {}) {
  const { limit = 12 } = options;
  return getProductsByTag("best-seller", {
    limit,
    orderBy: "created_at",
    ascending: false,
  });
}

// =====================================================
// SEARCH PRODUCTS
// =====================================================

/**
 * Search products by name or description
 * @param {string} searchTerm - Search query
 * @param {Object} options - Query options
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function searchProducts(searchTerm, options = {}) {
  const {
    limit = 20,
    offset = 0,
    category = null,
    subcategory = null,
  } = options;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
    )
    .is("deleted_at", null)
    .eq("in_stock", true);

  // Apply category filter if provided
  if (category) {
    query = query.eq("category", category);
  }

  // Apply subcategory filter if provided
  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  }

  query = query.order("created_at", { ascending: false });

  if (limit) {
    query = query.range(offset, offset + limit - 1);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(`❌ Error searching products for "${searchTerm}":`, error);
    return { data: null, error, count: 0 };
  }

  console.log(`✅ Found ${data?.length} products matching "${searchTerm}"`);
  return { data, error: null, count };
}

// =====================================================
// ADVANCED FILTERING
// =====================================================

/**
 * Filter products with multiple criteria
 * @param {Object} filters - Filter options
 * @param {string} filters.category - Category filter
 * @param {string} filters.subcategory - Subcategory filter
 * @param {Array<string>} filters.colors - Color filters
 * @param {Array<string>} filters.sizes - Size filters
 * @param {Array<string>} filters.materials - Material filters
 * @param {number} filters.minPrice - Minimum price in kobo
 * @param {number} filters.maxPrice - Maximum price in kobo
 * @param {Array<string>} filters.tags - Tag filters
 * @param {string} filters.sortBy - Sort field (price, created_at, name)
 * @param {boolean} filters.ascending - Sort order
 * @param {number} filters.limit - Result limit
 * @param {number} filters.offset - Result offset
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
export async function filterProducts(filters = {}) {
  const {
    category = null,
    subcategory = null,
    colors = [],
    sizes = [],
    materials = [],
    minPrice = null,
    maxPrice = null,
    tags = [],
    sortBy = "created_at",
    ascending = false,
    limit = 20,
    offset = 0,
  } = filters;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .eq("in_stock", true);

  // Category filters
  if (category) {
    query = query.eq("category", category);
  }

  if (subcategory) {
    query = query.eq("subcategory", subcategory);
  }

  // Color filter
  if (colors.length > 0) {
    query = query.in("color", colors);
  }

  // Size filter (array overlap)
  if (sizes.length > 0) {
    query = query.overlaps("size", sizes);
  }

  // Material filter
  if (materials.length > 0) {
    query = query.in("material", materials);
  }

  // Price range filter
  if (minPrice !== null) {
    query = query.gte("price", minPrice);
  }

  if (maxPrice !== null) {
    query = query.lte("price", maxPrice);
  }

  // Tag filter (array overlap)
  if (tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  // Sorting
  query = query.order(sortBy, { ascending });

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("❌ Error filtering products:", error);
    return { data: null, error, count: 0 };
  }

  console.log(`✅ Filtered ${data?.length} products (total matches: ${count})`);
  return { data, error: null, count };
}

// =====================================================
// RELATED PRODUCTS
// =====================================================

/**
 * Get related products based on category and tags
 * @param {string} productId - Current product ID
 * @param {string} category - Product category
 * @param {Array<string>} tags - Product tags
 * @param {number} limit - Number of results (default: 4)
 * @returns {Promise<{data: Array, error: any}>}
 */
export async function getRelatedProducts(
  productId,
  category,
  tags = [],
  limit = 4
) {
  // First, try to find products in same category with overlapping tags
  let query = supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .neq("id", productId)
    .is("deleted_at", null)
    .eq("in_stock", true);

  // Add tag overlap if tags exist
  if (tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  query = query.limit(limit);

  let { data, error } = await query;

  // If we don't have enough products, just get products from same category
  if (data && data.length < limit) {
    const remaining = limit - data.length;
    const { data: additionalData } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", productId)
      .not("id", "in", `(${data.map((p) => p.id).join(",")})`)
      .is("deleted_at", null)
      .eq("in_stock", true)
      .limit(remaining);

    if (additionalData) {
      data = [...data, ...additionalData];
    }
  }

  if (error) {
    console.error("❌ Error fetching related products:", error);
    return { data: null, error };
  }

  console.log(`✅ Fetched ${data?.length} related products`);
  return { data, error: null };
}

// =====================================================
// PRODUCT ANALYTICS
// =====================================================

/**
 * Increment product view count
 * @param {string} productId - Product ID
 */
export async function incrementProductViews(productId) {
  const { error } = await supabase.rpc("increment_product_views", {
    product_id: productId,
  });

  if (error) {
    console.error("❌ Error incrementing views:", error);
  }
}

/**
 * Increment product favorites count
 * @param {string} productId - Product ID
 */
export async function incrementProductFavorites(productId) {
  const { error } = await supabase.rpc("increment_product_favorites", {
    product_id: productId,
  });

  if (error) {
    console.error("❌ Error incrementing favorites:", error);
  }
}

/**
 * Decrement product favorites count
 * @param {string} productId - Product ID
 */
export async function decrementProductFavorites(productId) {
  const { error } = await supabase.rpc("decrement_product_favorites", {
    product_id: productId,
  });

  if (error) {
    console.error("❌ Error decrementing favorites:", error);
  }
}

// =====================================================
// GET UNIQUE VALUES (for filters)
// =====================================================

/**
 * Get all unique categories
 * @returns {Promise<{data: Array<string>, error: any}>}
 */
export async function getUniqueCategories() {
  const { data, error } = await supabase
    .from("products")
    .select("category")
    .is("deleted_at", null)
    .eq("in_stock", true);

  if (error) {
    console.error("❌ Error fetching categories:", error);
    return { data: null, error };
  }

  const categories = [...new Set(data.map((p) => p.category))];
  console.log(`✅ Fetched ${categories.length} unique categories`);
  return { data: categories, error: null };
}

/**
 * Get subcategories for a category
 * @param {string} category - Category name
 * @returns {Promise<{data: Array<string>, error: any}>}
 */
export async function getSubcategoriesByCategory(category) {
  const { data, error } = await supabase
    .from("products")
    .select("subcategory")
    .eq("category", category)
    .not("subcategory", "is", null)
    .is("deleted_at", null)
    .eq("in_stock", true);

  if (error) {
    console.error("❌ Error fetching subcategories:", error);
    return { data: null, error };
  }

  const subcategories = [...new Set(data.map((p) => p.subcategory))];
  console.log(
    `✅ Fetched ${subcategories.length} subcategories for ${category}`
  );
  return { data: subcategories, error: null };
}

/**
 * Get all unique colors
 * @returns {Promise<{data: Array<string>, error: any}>}
 */
export async function getUniqueColors() {
  const { data, error } = await supabase
    .from("products")
    .select("color")
    .not("color", "is", null)
    .is("deleted_at", null)
    .eq("in_stock", true);

  if (error) {
    console.error("❌ Error fetching colors:", error);
    return { data: null, error };
  }

  const colors = [...new Set(data.map((p) => p.color))];
  console.log(`✅ Fetched ${colors.length} unique colors`);
  return { data: colors, error: null };
}

/**
 * Get all unique sizes
 * @returns {Promise<{data: Array<string>, error: any}>}
 */
export async function getUniqueSizes() {
  const { data, error } = await supabase
    .from("products")
    .select("size")
    .is("deleted_at", null)
    .eq("in_stock", true);

  if (error) {
    console.error("❌ Error fetching sizes:", error);
    return { data: null, error };
  }

  // Flatten all size arrays and get unique values
  const sizes = [...new Set(data.flatMap((p) => p.size || []))];
  console.log(`✅ Fetched ${sizes.length} unique sizes`);
  return { data: sizes, error: null };
}

/**
 * Get all unique materials
 * @returns {Promise<{data: Array<string>, error: any}>}
 */
export async function getUniqueMaterials() {
  const { data, error } = await supabase
    .from("products")
    .select("material")
    .not("material", "is", null)
    .is("deleted_at", null)
    .eq("in_stock", true);

  if (error) {
    console.error("❌ Error fetching materials:", error);
    return { data: null, error };
  }

  const materials = [...new Set(data.map((p) => p.material))];
  console.log(`✅ Fetched ${materials.length} unique materials`);
  return { data: materials, error: null };
}

// =====================================================
// LOW STOCK PRODUCTS
// =====================================================

/**
 * Get products with low stock (for admin dashboard)
 * @param {number} limit - Result limit (default: 10)
 * @returns {Promise<{data: Array, error: any}>}
 */
export async function getLowStockProducts(limit = 10) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .is("deleted_at", null)
    .lte("stock_quantity", supabase.raw("low_stock_threshold"))
    .order("stock_quantity", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("❌ Error fetching low stock products:", error);
    return { data: null, error };
  }

  console.log(`✅ Fetched ${data?.length} low stock products`);
  return { data, error: null };
}

// =====================================================
// PRODUCT COUNT
// =====================================================

/**
 * Get total product count
 * @returns {Promise<{count: number, error: any}>}
 */
export async function getProductCount() {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)
    .eq("in_stock", true);

  if (error) {
    console.error("❌ Error getting product count:", error);
    return { count: 0, error };
  }

  console.log(`✅ Total products: ${count}`);
  return { count, error: null };
}
