USE wad_restaurant;

CREATE TEMPORARY TABLE IF NOT EXISTS new_foods (
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NULL,
  image VARCHAR(500) NULL,
  category VARCHAR(100) NULL
);

TRUNCATE TABLE new_foods;

INSERT INTO new_foods (name, price, description, image, category) VALUES
  (
    'Pho Bo Dac Biet',
    75000.00,
    'Beef noodle soup with sliced beef, brisket, herbs, onion, and rich house broth.',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=600&fit=crop',
    'pho'
  ),
  (
    'Pho Ga La Chanh',
    65000.00,
    'Chicken noodle soup with tender chicken, lime leaves, fresh herbs, and clear broth.',
    'https://images.unsplash.com/photo-1583224964978-2257b1c8f725?w=600&h=600&fit=crop',
    'pho'
  ),
  (
    'Bun Bo Hue',
    79000.00,
    'Spicy beef noodle soup with lemongrass broth, beef slices, herbs, and chili oil.',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop',
    'pho'
  ),
  (
    'Bun Cha Ha Noi',
    72000.00,
    'Grilled pork patties with rice noodles, fresh herbs, pickles, and dipping sauce.',
    'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=600&fit=crop',
    'pho'
  ),
  (
    'Com Tam Suon Bi Cha',
    85000.00,
    'Broken rice with grilled pork chop, shredded pork skin, egg meatloaf, pickles, and fish sauce.',
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop',
    'com'
  ),
  (
    'Com Ga Hoi An',
    78000.00,
    'Turmeric rice with shredded chicken, herbs, onion, pickles, and chili ginger sauce.',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=600&fit=crop',
    'com'
  ),
  (
    'Com Bo Luc Lac',
    95000.00,
    'Shaking beef with steamed rice, salad, tomato, cucumber, and pepper lime sauce.',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=600&fit=crop',
    'com'
  ),
  (
    'Com Chien Hai San',
    89000.00,
    'Seafood fried rice with shrimp, squid, egg, vegetables, and scallion.',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=600&fit=crop',
    'com'
  ),
  (
    'Banh Mi Thit Nuong',
    45000.00,
    'Crispy baguette with grilled pork, pate, pickled vegetables, cucumber, and herbs.',
    'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=600&h=600&fit=crop',
    'banhmi'
  ),
  (
    'Banh Mi Ga Xe',
    43000.00,
    'Crispy baguette with shredded chicken, house mayo, pickles, herbs, and chili.',
    'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=600&fit=crop',
    'banhmi'
  ),
  (
    'Banh Mi Bo Kho',
    59000.00,
    'Warm baguette served with slow cooked beef stew, carrots, herbs, and lime.',
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=600&fit=crop',
    'banhmi'
  ),
  (
    'Banh Mi Chay',
    39000.00,
    'Vegetarian baguette with tofu, mushrooms, pickled vegetables, cucumber, and soy sauce.',
    'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=600&h=600&fit=crop',
    'banhmi'
  ),
  (
    'Goi Cuon Tom Thit',
    52000.00,
    'Fresh spring rolls with shrimp, pork, vermicelli, lettuce, herbs, and peanut sauce.',
    'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=600&h=600&fit=crop',
    'cuon'
  ),
  (
    'Cha Gio Hai San',
    58000.00,
    'Crispy seafood spring rolls with lettuce, herbs, and sweet fish sauce.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=600&fit=crop',
    'cuon'
  ),
  (
    'Goi Ga Rau Ram',
    62000.00,
    'Chicken salad with Vietnamese coriander, onion, cabbage, roasted peanuts, and lime dressing.',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
    'cuon'
  ),
  (
    'Dau Hu Chien Xa Ot',
    49000.00,
    'Crispy tofu tossed with lemongrass, chili, garlic, and scallion.',
    'https://images.unsplash.com/photo-1608500218890-c4f16c3e5711?w=600&h=600&fit=crop',
    'cuon'
  ),
  (
    'Tra Dao Cam Sa',
    39000.00,
    'Peach orange lemongrass iced tea with fresh citrus and peach slices.',
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
    'douong'
  ),
  (
    'Ca Phe Sua Da',
    35000.00,
    'Vietnamese iced coffee with condensed milk and bold roasted coffee.',
    'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&h=600&fit=crop',
    'douong'
  ),
  (
    'Nuoc Chanh Day',
    37000.00,
    'Passion fruit lemonade served cold with fresh lime and light syrup.',
    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop',
    'douong'
  ),
  (
    'Sinh To Xoai',
    45000.00,
    'Creamy mango smoothie with fresh mango, yogurt, and crushed ice.',
    'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=600&fit=crop',
    'douong'
  ),
  (
    'Combo Pho Bo Ca Phe',
    99000.00,
    'Pho Bo Dac Biet served with Vietnamese iced coffee.',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=600&fit=crop',
    'combo'
  ),
  (
    'Combo Com Tam Tra Dao',
    109000.00,
    'Com Tam Suon Bi Cha served with peach orange lemongrass iced tea.',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop',
    'combo'
  ),
  (
    'Combo Banh Mi Goi Cuon',
    89000.00,
    'Banh Mi Thit Nuong paired with fresh shrimp and pork spring rolls.',
    'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=600&h=600&fit=crop',
    'combo'
  ),
  (
    'Family Combo 4 Mon',
    299000.00,
    'A shared set with Pho Ga, Com Bo Luc Lac, Goi Cuon, Cha Gio, and iced tea.',
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=600&fit=crop',
    'combo'
  );

INSERT INTO foods (name, price, description, image, category)
SELECT nf.name, nf.price, nf.description, nf.image, nf.category
FROM new_foods AS nf
WHERE NOT EXISTS (
  SELECT 1
  FROM foods AS f
  WHERE f.name = nf.name
);

DROP TEMPORARY TABLE new_foods;
