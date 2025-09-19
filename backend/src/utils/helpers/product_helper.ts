// Categories Table
export interface Category {
  id: string;                // uuid
  name: string;
  description?: string | null;
}

// Products Table
export interface Product {
  id: string;                
  seller_id: string;        
  category_id?: string | null; 
  name: string;
  description?: string | null;
  price: number;             // numeric
  stock: number;             // default 0
  image_url?: [string] | null;
  created_at: string;        // timestamp
  updated_at: string;        // timestamp
}

// Product Images Table
export interface ProductImage {
  id: string;                // uuid
  product_id: string;        // uuid
  image_url: string;
  position?: number;         // default 1
  created_at: string;        // timestamp
}

// Product Variants Table
export interface ProductVariant {
  id: string;                // uuid
  product_id: string;        // uuid
  name?: string | null;
  price?: number | null;     // numeric
  stock: number;             // default 0
  created_at: string;        // timestamp
}

// Reviews Table
export interface Review {
  id: string;                // uuid
  product_id: string;        // uuid
  profile_id: string;        // uuid
  rating: number;            // 1–5
  comment?: string | null;
  created_at: string;        // timestamp
}

// Wishlists Table
export interface Wishlist {
  id: string;                // uuid
  profile_id: string;        // uuid
  product_id: string;        // uuid
  created_at: string;        // timestamp
}

// Cart Items Table
export interface CartItem {
  id: string;                // uuid
  profile_id: string;        // uuid
  product_id: string;        // uuid
  quantity: number;          // integer
  created_at: string;        // timestamp
}

// Order Items Table (Optional but product-related)
export interface OrderItem {
  id: string;                // uuid
  order_id: string;          // uuid
  product_id: string;        // uuid
  quantity: number;
  price: number;             // numeric
}
