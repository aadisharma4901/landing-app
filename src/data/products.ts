export interface Product {
  id: number;
  name: string;
  category: 'watches' | 'phones' | 'laptops' | 'pcs' | 'cpu' | 'gpu';
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  badge?: 'bestseller' | 'new' | 'sale';
  description: string;
  imageUrl: string;
  specifications: { label: string; value: string }[];
  features: string[];
}

export const products: Product[] = [
  // Watches
  {
    id: 1,
    name: "Premium Chronograph Watch",
    category: "watches",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 2341,
    stock: "in_stock",
    badge: "bestseller",
    description: "Swiss precision chronograph with sapphire crystal glass and automatic movement. Water resistant to 100 meters.",
    imageUrl: "https://loremflickr.com/600/600/watch,wristwatch",
    specifications: [
      { label: "Movement", value: "Automatic Mechanical" },
      { label: "Glass", value: "Sapphire Crystal" },
      { label: "Water Resistance", value: "100m" },
      { label: "Case Material", value: "Stainless Steel" },
      { label: "Band", value: "Genuine Leather" }
    ],
    features: ["Chronograph Function", "Date Display", "Luminous Hands", "Screw-down Crown"]
  },
  {
    id: 2,
    name: "Smartwatch Pro Max",
    category: "watches",
    price: 449,
    rating: 4.6,
    reviews: 5672,
    stock: "in_stock",
    badge: "new",
    description: "Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Always-on AMOLED display.",
    imageUrl: "https://loremflickr.com/600/600/smartwatch,applewatch",
    specifications: [
      { label: "Display", value: "1.4\" AMOLED" },
      { label: "Battery", value: "7 Days" },
      { label: "Water Resistance", value: "50m" },
      { label: "Sensors", value: "Heart Rate, SpO2, GPS" }
    ],
    features: ["Health Tracking", "Notifications", "Workout Modes", "Sleep Analysis"]
  },
  {
    id: 3,
    name: "Classic Automatic Watch",
    category: "watches",
    price: 189,
    originalPrice: 249,
    rating: 4.5,
    reviews: 1823,
    stock: "in_stock",
    badge: "sale",
    description: "Elegant automatic watch with exhibition case back. Perfect for everyday wear and formal occasions.",
    imageUrl: "https://loremflickr.com/600/600/luxurywatch,classic",
    specifications: [
      { label: "Movement", value: "Automatic" },
      { label: "Glass", value: "Hardened Mineral" },
      { label: "Case Size", value: "40mm" },
      { label: "Water Resistance", value: "50m" }
    ],
    features: ["Exhibition Back", "Skeleton Design", "21 Jewels", "42hr Power Reserve"]
  },

  // Phones
  {
    id: 4,
    name: "Galaxy Ultra Pro",
    category: "phones",
    price: 1199,
    rating: 4.7,
    reviews: 8934,
    stock: "in_stock",
    badge: "bestseller",
    description: "Flagship smartphone with 200MP camera, S Pen, and 5000mAh battery. 5G ready with Snapdragon processor.",
    imageUrl: "https://loremflickr.com/600/600/smartphone,android",
    specifications: [
      { label: "Display", value: "6.8\" Dynamic AMOLED" },
      { label: "Processor", value: "Snapdragon 8 Gen 3" },
      { label: "RAM", value: "12GB" },
      { label: "Storage", value: "256GB" },
      { label: "Battery", value: "5000mAh" }
    ],
    features: ["S Pen Support", "200MP Camera", "120Hz Refresh Rate", "IP68 Waterproof"]
  },
  {
    id: 5,
    name: "iPhone Pro Max",
    category: "phones",
    price: 1299,
    rating: 4.8,
    reviews: 12453,
    stock: "low_stock",
    description: "A17 Pro chip, titanium design, and USB-C. Professional camera system with 5x optical zoom.",
    imageUrl: "https://loremflickr.com/600/600/iphone,apple",
    specifications: [
      { label: "Display", value: "6.7\" Super Retina XDR" },
      { label: "Chip", value: "A17 Pro" },
      { label: "Storage", value: "256GB" },
      { label: "Battery", value: "All-day Battery" }
    ],
    features: ["Titanium Design", "Pro Camera System", "USB 3.0 Speed", "Action Button"]
  },
  {
    id: 6,
    name: "Pixel 9 Pro XL",
    category: "phones",
    price: 999,
    rating: 4.5,
    reviews: 4521,
    stock: "in_stock",
    badge: "new",
    description: "Google AI powered smartphone with best-in-class photography. Tensor G4 chip and 24hr battery.",
    imageUrl: "https://loremflickr.com/600/600/googlepixel,smartphone",
    specifications: [
      { label: "Display", value: "6.8\" OLED" },
      { label: "Chip", value: "Tensor G4" },
      { label: "RAM", value: "16GB" },
      { label: "Storage", value: "128GB" }
    ],
    features: ["Google AI Features", "Advanced Photography", "7yr Updates", "Fast Charging"]
  },

  // Laptops
  {
    id: 7,
    name: "MacBook Pro 16\"",
    category: "laptops",
    price: 2499,
    rating: 4.9,
    reviews: 15234,
    stock: "in_stock",
    badge: "bestseller",
    description: "M3 Max chip with 16-core CPU and 40-core GPU. 36GB unified memory, 1TB SSD storage.",
    imageUrl: "https://loremflickr.com/600/600/macbook,laptop",
    specifications: [
      { label: "Chip", value: "M3 Max" },
      { label: "CPU Cores", value: "16" },
      { label: "GPU Cores", value: "40" },
      { label: "Memory", value: "36GB" },
      { label: "Storage", value: "1TB SSD" },
      { label: "Display", value: "16.2\" Liquid Retina XDR" }
    ],
    features: ["22hr Battery Life", "Mini-LED Display", "MagSafe Charging", "Studio-quality Mics"]
  },
  {
    id: 8,
    name: "ROG Strix Gaming Laptop",
    category: "laptops",
    price: 1899,
    originalPrice: 2199,
    rating: 4.7,
    reviews: 6732,
    stock: "in_stock",
    badge: "sale",
    description: "High performance gaming laptop with RTX 4080 GPU, 14th Gen i9, and 240Hz QHD display.",
    imageUrl: "https://loremflickr.com/600/600/gaminglaptop,rog",
    specifications: [
      { label: "Processor", value: "Intel i9-14900HX" },
      { label: "Graphics", value: "RTX 4080 12GB" },
      { label: "RAM", value: "32GB DDR5" },
      { label: "Storage", value: "2TB NVMe" },
      { label: "Display", value: "16\" QHD 240Hz" }
    ],
    features: ["Advanced Cooling", "RGB Keyboard", "Thunderbolt 4", "WiFi 6E"]
  },

  // PC Components
  {
    id: 9,
    name: "Intel Core i9-14900K",
    category: "cpu",
    price: 589,
    rating: 4.8,
    reviews: 3421,
    stock: "in_stock",
    description: "24 cores (8P+16E), 6GHz max boost frequency. Unlocked multiplier for overclocking.",
    imageUrl: "https://loremflickr.com/600/600/intelprocessor,cpu",
    specifications: [
      { label: "Cores/Threads", value: "24/32" },
      { label: "Base Clock", value: "3.2GHz" },
      { label: "Boost Clock", value: "6.0GHz" },
      { label: "Cache", value: "36MB" },
      { label: "TDP", value: "125W" }
    ],
    features: ["PCIe 5.0 Support", "DDR5-5600", "Unlocked Multiplier", "Intel UHD 770"]
  },
  {
    id: 10,
    name: "AMD Ryzen 9 7950X3D",
    category: "cpu",
    price: 699,
    rating: 4.9,
    reviews: 4123,
    stock: "low_stock",
    badge: "bestseller",
    description: "16 cores 32 threads with 3D V-Cache technology. Best gaming performance available.",
    imageUrl: "https://loremflickr.com/600/600/amdprocessor,ryzen",
    specifications: [
      { label: "Cores/Threads", value: "16/32" },
      { label: "Base Clock", value: "4.2GHz" },
      { label: "Boost Clock", value: "5.7GHz" },
      { label: "Cache", value: "144MB" },
      { label: "TDP", value: "120W" }
    ],
    features: ["3D V-Cache", "PCIe 5.0", "DDR5 Support", "144MB Total Cache"]
  },
  {
    id: 11,
    name: "NVIDIA RTX 4090",
    category: "gpu",
    price: 1599,
    rating: 4.8,
    reviews: 8734,
    stock: "in_stock",
    description: "Flagship Ada Lovelace GPU with 24GB GDDR6X. DLSS 3, Ray Tracing, and 16384 CUDA cores.",
    imageUrl: "https://loremflickr.com/600/600/nvidiagraphicscard,gpu",
    specifications: [
      { label: "CUDA Cores", value: "16384" },
      { label: "Memory", value: "24GB GDDR6X" },
      { label: "Memory Speed", value: "21Gbps" },
      { label: "TDP", value: "450W" },
      { label: "Process", value: "TSMC 4N" }
    ],
    features: ["DLSS 3 Technology", "Ray Tracing Cores", "Tensor Cores", "NVIDIA Reflex"]
  },
  {
    id: 12,
    name: "AMD Radeon RX 7900 XTX",
    category: "gpu",
    price: 999,
    originalPrice: 1199,
    rating: 4.6,
    reviews: 5231,
    stock: "in_stock",
    badge: "sale",
    description: "24GB GDDR6, RDNA 3 architecture. Excellent 4K gaming performance with FSR 3.",
    imageUrl: "https://loremflickr.com/600/600/amdgraphicscard,radeon",
    specifications: [
      { label: "Stream Processors", value: "6144" },
      { label: "Memory", value: "24GB GDDR6" },
      { label: "Memory Bus", value: "384-bit" },
      { label: "Boost Clock", value: "2.5GHz" },
      { label: "TDP", value: "355W" }
    ],
    features: ["RDNA 3 Architecture", "FSR 3 Support", "Ray Accelerators", "Av1 Encoding"]
  },

  // Desktop PCs
  {
    id: 13,
    name: "Gaming PC RTX 4090",
    category: "pcs",
    price: 3499,
    rating: 4.9,
    reviews: 2876,
    stock: "in_stock",
    badge: "bestseller",
    description: "Ultimate gaming PC with RTX 4090, Intel i9-14900K, 64GB DDR5, and 4TB NVMe SSD. Ready for 4K max settings gaming.",
    imageUrl: "https://loremflickr.com/600/600/gamingpc,desktop",
    specifications: [
      { label: "Processor", value: "Intel i9-14900K" },
      { label: "Graphics", value: "RTX 4090 24GB" },
      { label: "Memory", value: "64GB DDR5-6000" },
      { label: "Storage", value: "4TB NVMe SSD" },
      { label: "PSU", value: "1200W Platinum" },
      { label: "Cooling", value: "Custom Liquid" }
    ],
    features: ["4K Ready", "VR Ready", "Overclocked", "WiFi 6E", "Windows 11"]
  },
  {
    id: 14,
    name: "Creator Workstation PC",
    category: "pcs",
    price: 2799,
    rating: 4.8,
    reviews: 1543,
    stock: "in_stock",
    description: "Professional workstation optimized for video editing, 3D rendering, and content creation.",
    imageUrl: "https://loremflickr.com/600/600/workstation,pc",
    specifications: [
      { label: "Processor", value: "AMD Ryzen 9 7950X" },
      { label: "Graphics", value: "RTX 4080 Super" },
      { label: "Memory", value: "128GB DDR5" },
      { label: "Storage", value: "8TB NVMe SSD" },
      { label: "PSU", value: "1000W Gold" }
    ],
    features: ["Ultra Quiet", "Render Optimized", "ECC Memory Support", "Thunderbolt 4"]
  },
  {
    id: 15,
    name: "Budget Gaming PC",
    category: "pcs",
    price: 899,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 4256,
    stock: "in_stock",
    badge: "sale",
    description: "Great entry level gaming PC that handles all modern games at 1080p high settings.",
    imageUrl: "https://loremflickr.com/600/600/pc,gamingcomputer",
    specifications: [
      { label: "Processor", value: "AMD Ryzen 5 7600X" },
      { label: "Graphics", value: "RTX 4060 8GB" },
      { label: "Memory", value: "16GB DDR5" },
      { label: "Storage", value: "1TB NVMe SSD" },
      { label: "PSU", value: "650W Bronze" }
    ],
    features: ["1080p Gaming", "Upgradable", "3 Year Warranty", "Pre-installed Windows"]
  },
  {
    id: 16,
    name: "Mini ITX Gaming PC",
    category: "pcs",
    price: 1899,
    rating: 4.7,
    reviews: 1892,
    stock: "low_stock",
    badge: "new",
    description: "Compact gaming powerhouse in mini ITX form factor. Perfect for small spaces.",
    imageUrl: "https://loremflickr.com/600/600/minipc,itx",
    specifications: [
      { label: "Processor", value: "Intel i7-14700K" },
      { label: "Graphics", value: "RTX 4070 Ti Super" },
      { label: "Memory", value: "32GB DDR5" },
      { label: "Storage", value: "2TB NVMe SSD" },
      { label: "Case Size", value: "Mini ITX" }
    ],
    features: ["Small Form Factor", "Quiet Cooling", "Portable", "High Performance"]
  }
];

export const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'watches', name: 'Watches', count: products.filter(p => p.category === 'watches').length },
  { id: 'phones', name: 'Smartphones', count: products.filter(p => p.category === 'phones').length },
  { id: 'laptops', name: 'Laptops', count: products.filter(p => p.category === 'laptops').length },
  { id: 'cpu', name: 'Processors', count: products.filter(p => p.category === 'cpu').length },
  { id: 'gpu', name: 'Graphics Cards', count: products.filter(p => p.category === 'gpu').length },
  { id: 'pcs', name: 'Desktop PCs', count: products.filter(p => p.category === 'pcs').length }
];