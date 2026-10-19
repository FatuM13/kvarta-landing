import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Landing Page Content & Pricing Specification Compliance', () => {
  const productsFile = fs.readFileSync(
    path.join(process.cwd(), 'src/components/Products.tsx'),
    'utf-8'
  );
  const deliveryFile = fs.readFileSync(
    path.join(process.cwd(), 'src/components/DeliverySection.tsx'),
    'utf-8'
  );
  const storyFile = fs.readFileSync(
    path.join(process.cwd(), 'src/components/Story.tsx'),
    'utf-8'
  );

  it('contains all 5 exact offerings with correct prices', () => {
    // 1. Ethiopia
    expect(productsFile).toContain('Эфиопия Иргачеффе');
    expect(productsFile).toContain('32 BYN');
    expect(productsFile).toContain('цветочный аромат');
    expect(productsFile).toContain('бергамот');
    expect(productsFile).toContain('светлая');

    // 2. Colombia
    expect(productsFile).toContain('Колумбия Уила');
    expect(productsFile).toContain('29 BYN');
    expect(productsFile).toContain('карамель');
    expect(productsFile).toContain('красное яблоко');

    // 3. Brazil
    expect(productsFile).toContain('Бразилия Серрадо');
    expect(productsFile).toContain('26 BYN');
    expect(productsFile).toContain('орех');
    expect(productsFile).toContain('шоколад');
    expect(productsFile).toContain('под эспрессо');

    // 4. Drips
    expect(productsFile).toContain('Дрип-пакеты, ассорти');
    expect(productsFile).toContain('18 BYN');
    expect(productsFile).toContain('10 штук');

    // 5. Subscription
    expect(productsFile).toContain('Кофейная подписка');
    expect(productsFile).toContain('54 BYN');
    expect(productsFile).toContain('Две свежие пачки по 250 г');
  });

  it('contains correct pickup address and working hours', () => {
    expect(deliveryFile).toContain('Минск, ул. Короля, 9');
    expect(deliveryFile).toContain('8:00–20:00');
    expect(deliveryFile).toContain('10:00–18:00');
  });

  it('contains correct delivery schedule and free delivery threshold', () => {
    expect(deliveryFile).toContain('Доставка по пятницам');
    expect(deliveryFile).toContain('50 BYN');
  });

  it('contains founders Anya and Dmitry and 5kg batches', () => {
    expect(storyFile).toContain('Аня и Дмитрий');
    expect(storyFile).toContain('5 кг');
    expect(storyFile).toContain('2019');
  });
});
