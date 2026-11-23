import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product, ProductColor } from '../types';
import productsFallback from '../../server/data/products.json';
import { Hero } from '../components/home/Hero';
import { TryTheLookStudio } from '../components/home/TryTheLookStudio';
import { CuratedCollections } from '../components/home/CuratedCollections';
import { InstagramFeed } from '../components/home/InstagramFeed';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsFallback as unknown as Product[]);
  const [loading, setLoading] = useState(false);

  // Shared Gender & Active Look between Hero and Carousel Studio
  const [selectedGender, setSelectedGender] = useState<'womens' | 'mens'>('womens');
  const [activeLookIndex, setActiveLookIndex] = useState<number>(() => {
    const defaultIdx = (productsFallback[0]?.colors as any[])?.findIndex((c: any) => c.code === 'surgical-blue') ?? 0;
    return Math.max(0, defaultIdx);
  });

  const womensProduct = products.find(p => p.category === 'womens-scrubs') || products[0];
  const mensProduct = products.find(p => p.category === 'mens-scrubs') || products[1] || products[0];
  const activeProduct = selectedGender === 'womens' ? womensProduct : mensProduct;
  const colors = activeProduct?.colors || [];
  const currentColor: ProductColor | undefined = colors[activeLookIndex] || colors[0];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.getProducts();
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load products for homepage', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* 1. Hero: Soft-Blurred Video, 2-Line Headline, Core CTAs & Linked Model */}
      <Hero 
        activeGender={selectedGender}
        currentColor={currentColor}
      />

      {/* 2. "Try the Look" Interactive Studio: 3D perspective floor, Dual-Tone Mix & Match, Linked Carousel */}
      <TryTheLookStudio 
        products={products}
        selectedGender={selectedGender}
        onSelectGender={setSelectedGender}
        activeLookIndex={activeLookIndex}
        onSelectLookIndex={setActiveLookIndex}
      />

      {/* 4. Flagship Scrub Collections with 360° Front/Back Angle Flip Cards */}
      <CuratedCollections products={products} />

      {/* 5. Interactive Instagram & Hospital Ward Shifts Feed */}
      <InstagramFeed />
    </div>
  );
};
