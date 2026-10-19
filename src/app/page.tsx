'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Story } from '@/components/Story';
import { FreshnessCycle } from '@/components/FreshnessCycle';
import { Products } from '@/components/Products';
import { DeliverySection } from '@/components/DeliverySection';
import { OrderForm } from '@/components/OrderForm';
import { Footer } from '@/components/Footer';
import { InterestType } from '@/lib/types';

const INITIAL_QUANTITIES: Record<string, number> = {
  ethiopia: 0,
  colombia: 0,
  brazil: 0,
  drips: 0,
  subscription: 0,
};

function mapProductToKey(nameOrId: string): string {
  const lower = nameOrId.toLowerCase();
  if (lower.includes('эфиоп') || lower.includes('ethiopia')) return 'ethiopia';
  if (lower.includes('колумб') || lower.includes('colombia')) return 'colombia';
  if (lower.includes('бразил') || lower.includes('brazil')) return 'brazil';
  if (lower.includes('дрип') || lower.includes('drip')) return 'drips';
  if (lower.includes('подписк') || lower.includes('subscription')) return 'subscription';
  return 'ethiopia';
}

export default function Home() {
  const [quantities, setQuantities] = useState<Record<string, number>>(INITIAL_QUANTITIES);
  const [interestType, setInterestType] = useState<InterestType>('order');

  const scrollToForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Focus name or phone after smooth scroll
      setTimeout(() => {
        const input = document.getElementById('customer-name');
        if (input) input.focus();
      }, 500);
    }
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleIncrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    if (productId === 'subscription') {
      setInterestType('subscription');
    } else if (interestType === 'question') {
      setInterestType('order');
    }
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }));
  };

  const handleResetQuantities = () => {
    setQuantities(INITIAL_QUANTITIES);
  };

  const handleSelectProduct = (productName: string, interest: InterestType) => {
    const key = mapProductToKey(productName);
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev[key] || 0) + 1),
    }));
    setInterestType(interest);
    scrollToForm();
  };

  const handleSubscriptionClick = () => {
    setQuantities((prev) => ({
      ...prev,
      subscription: Math.max(1, (prev.subscription || 0) + 1),
    }));
    setInterestType('subscription');
    scrollToForm();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with sticky announcement */}
      <Header onOrderClick={scrollToForm} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onCatalogClick={scrollToProducts}
          onSubscriptionClick={handleSubscriptionClick}
        />

        {/* Story Section */}
        <Story />

        {/* Freshness & Production Schedule */}
        <FreshnessCycle />

        {/* Exact 5 Product Offerings */}
        <Products onSelectProduct={handleSelectProduct} />

        {/* Delivery & Pickup Terms */}
        <DeliverySection />

        {/* Lead Capture Form with Multi-Selection & Quantity Controls */}
        <OrderForm
          quantities={quantities}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onResetQuantities={handleResetQuantities}
          interestType={interestType}
          onInterestChange={setInterestType}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
