export type ProductCategory = 'solar-panel' | 'battery';

export interface ProductVariant {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  variants: ProductVariant[];
  warrantyYears: number;
}

// Solar panel sizes by surface area
const solarPanelVariants: ProductVariant[] = [
  { id: 'sp-sm', label: 'Small', description: '1.2m² — 200W', price: 249.99 },
  { id: 'sp-md', label: 'Medium', description: '1.7m² — 350W', price: 399.99 },
  { id: 'sp-lg', label: 'Large', description: '2.2m² — 450W', price: 549.99 },
  { id: 'sp-xl', label: 'Extra Large', description: '2.8m² — 550W', price: 699.99 },
];

// Battery sizes by capacity
const batteryVariants: ProductVariant[] = [
  { id: 'bt-5', label: '5 kWh', description: 'Compact — ideal for small homes', price: 1299.99 },
  { id: 'bt-10', label: '10 kWh', description: 'Standard — powers a medium home', price: 2199.99 },
  { id: 'bt-15', label: '15 kWh', description: 'Extended — full-day backup', price: 3099.99 },
  { id: 'bt-20', label: '20 kWh', description: 'Max — off-grid ready', price: 3999.99 },
];

export const products: Product[] = [
  {
    id: 'solar-panel-mono',
    name: 'Monocrystalline Solar Panel',
    category: 'solar-panel',
    description:
      'High-efficiency monocrystalline solar panel with anti-reflective coating. Performs well in low-light conditions with a 25-year performance warranty.',
    image: '☀️',
    variants: solarPanelVariants,
    warrantyYears: 25,
  },
  {
    id: 'solar-panel-poly',
    name: 'Polycrystalline Solar Panel',
    category: 'solar-panel',
    description:
      'Cost-effective polycrystalline solar panel. Reliable performance with excellent value for residential installations.',
    image: '🌤️',
    variants: solarPanelVariants,
    warrantyYears: 20,
  },
  {
    id: 'solar-panel-thin',
    name: 'Thin-Film Solar Panel',
    category: 'solar-panel',
    description:
      'Flexible thin-film solar panel that can be mounted on curved surfaces. Lightweight and easy to install.',
    image: '🔆',
    variants: [
      { id: 'tf-sm', label: 'Small', description: '1.0m² — 120W', price: 199.99 },
      { id: 'tf-md', label: 'Medium', description: '1.5m² — 200W', price: 329.99 },
      { id: 'tf-lg', label: 'Large', description: '2.0m² — 300W', price: 459.99 },
    ],
    warrantyYears: 15,
  },
  {
    id: 'battery-lithium',
    name: 'Lithium-Ion Battery Pack',
    category: 'battery',
    description:
      'Premium lithium-ion battery storage system. Fast charging, long cycle life, and built-in battery management system.',
    image: '🔋',
    variants: batteryVariants,
    warrantyYears: 10,
  },
  {
    id: 'battery-lfp',
    name: 'LFP Battery Pack',
    category: 'battery',
    description:
      'Lithium iron phosphate battery with superior thermal stability. Longer lifespan and safer chemistry for home installations.',
    image: '⚡',
    variants: [
      { id: 'lfp-5', label: '5 kWh', description: 'Compact — 6000+ cycles', price: 1499.99 },
      { id: 'lfp-10', label: '10 kWh', description: 'Standard — 6000+ cycles', price: 2499.99 },
      { id: 'lfp-15', label: '15 kWh', description: 'Extended — 6000+ cycles', price: 3499.99 },
      { id: 'lfp-20', label: '20 kWh', description: 'Max — 6000+ cycles', price: 4499.99 },
    ],
    warrantyYears: 12,
  },
  {
    id: 'battery-saltwater',
    name: 'Saltwater Battery',
    category: 'battery',
    description:
      'Eco-friendly saltwater battery. Non-toxic, fully recyclable, and maintenance-free energy storage for green-conscious homeowners.',
    image: '🌊',
    variants: [
      { id: 'sw-8', label: '8 kWh', description: 'Standard — eco-friendly', price: 1899.99 },
      { id: 'sw-12', label: '12 kWh', description: 'Extended — eco-friendly', price: 2699.99 },
    ],
    warrantyYears: 8,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

