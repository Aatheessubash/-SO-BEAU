import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import productsFallback from '../../server/data/products.json';
import { Hero } from '../components/home/Hero';
import { TryTheLookStudio } from '../components/home/TryTheLookStudio';
import { CuratedCollections } from '../components/home/CuratedCollections';
import { ClinicalFeatureInspector } from '../components/home/ClinicalFeatureInspector';
import { HorizontalLookbook } from '../components/home/HorizontalLookbook';
import { PhilosophySection } from '../components/home/PhilosophySection';
import { InstagramFeed } from '../components/home/InstagramFeed';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productsFallback as unknown as Product[]);
  const [loading, setLoading] = useState(false);

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
      {/* 1. Hero: Soft-Blurred Video, 2-Line Headline, Core CTAs & Models Showcase */}
      <Hero />

      {/* 2. "Try the Look" Interactive Studio: 3D perspective floor, Dual-Tone Mix & Match, Pieces Drawer */}
      <TryTheLookStudio products={products} />

      {/* 4. Flagship Scrub Collections with 360° Front/Back Angle Flip Cards */}
      <CuratedCollections products={products} />

      {/* 5. Anatomical Clinical Blueprint & Feature Inspector with Pulse Hotspots */}
      <ClinicalFeatureInspector />

      {/* 6. Brand Value & Founder Philosophy Manifesto */}
      <PhilosophySection />

      {/* 7. Draggable Editorial Hospital Ward Lookbook */}
      <HorizontalLookbook />

      {/* 8. Interactive Instagram & Hospital Ward Shifts Feed */}
      <InstagramFeed />
    </div>
  );
};
