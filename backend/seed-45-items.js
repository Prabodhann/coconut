const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/babumac/.gemini/antigravity/brain/c61b0c99-adb7-4785-a65f-f1d259a724dd';

const images = {
  Salad: ['salad_1_1776524535844.png', 'salad_2_1776524766763.png'],
  Rolls: ['rolls_1_1776524552483.png', 'rolls_2_1776524783030.png'],
  Deserts: ['deserts_1_1776524568046.png', 'deserts_2_1776524801599.png'],
  Sandwich: ['sandwich_1_1776524584288.png', 'sandwich_2_1776524817009.png'],
  Cake: ['cake_1_1776524602601.png', 'cake_2_1776524832064.png'],
  'Pure Veg': ['pure_veg_1_1776524622196.png', 'pure_veg_2_1776524847135.png'],
  Pasta: ['pasta_1_1776524639635.png', 'pasta_2_1776524863225.png'],
  Noodles: ['noodles_1_1776524654878.png', 'noodles_2_1776524878537.png'],
  Chinese: ['chinese_1_1776524670563.png']
};

const itemsToSeed = [
  // 5 salads
  { category: "Salad", name: "Roasted Chana & Feta", description: "A high-protein crunch salad uniting roasted spiced chickpeas, creamy feta blocks, and fresh mint.", price: 130 },
  { category: "Salad", name: "Summer Spiced Mango Salad", description: "Vibrant Summer Spiced Mango Salad with fresh greens and mint, tossed in a tangy honey-lime dressing.", price: 150 },
  { category: "Salad", name: "Smoked Tandoori Chicken Salad", description: "Crisp greens topped with smoky tandoori chicken strips, grilled corn, and a light yogurt dressing.", price: 190 },
  { category: "Salad", name: "Quinoa Paneer Power Bowl", description: "Healthy protein-packed bowl with fluffy quinoa, grilled paneer, cherry tomatoes, and lemon vinaigrette.", price: 175 },
  { category: "Salad", name: "Spicy Peanut Crunch Salad", description: "Shredded cabbage and carrots mixed with toasted peanuts and tossed in a spicy chili-peanut dressing.", price: 140 },

  // 5 Rolls
  { category: "Rolls", name: "Chicken Tikka Roomali Roll", description: "Toasted Chicken Tikka Roomali Roll with fiery mint chutney dripping.", price: 160 },
  { category: "Rolls", name: "Spicy Paneer Kathi Roll", description: "Golden flaky paratha wrapped tightly around spicy paneer pieces.", price: 140 },
  { category: "Rolls", name: "Mutton Seekh Kebab Roll", description: "Succulent minced mutton skewers rolled in layered flatbread with sliced red onions.", price: 210 },
  { category: "Rolls", name: "Egg & Cheese Schezwan Roll", description: "Fluffy double egg paratha loaded with melted cheese and spicy Indo-Chinese Schezwan sauce.", price: 110 },
  { category: "Rolls", name: "Mushroom Malai Roll", description: "Creamy, mildly spiced mushroom and green peas filling wrapped inside a soft paratha.", price: 130 },

  // 5 Deserts
  { category: "Deserts", name: "Saffron Rasmalai Bowl", description: "Gourmet saffron Rasmalai topped with chopped pistachios.", price: 95 },
  { category: "Deserts", name: "Sizzling Brownie with Ice Cream", description: "Sizzling Brownie topped with melting Cardamom Ice Cream on a hot iron skillet.", price: 145 },
  { category: "Deserts", name: "Rose Petal Gulab Jamun", description: "Classic hot gulab jamun soaked in rich rose water syrup and garnished with dried petals.", price: 80 },
  { category: "Deserts", name: "Mango Shrikhand Delight", description: "Thick strained yogurt dessert infused with sweet alphonso mango pulp and saffron threads.", price: 110 },
  { category: "Deserts", name: "Pistachio Kulfi Slice", description: "Traditional frozen Indian dairy dessert rich with crushed pistachios and aromatic cardamom.", price: 90 },

  // 5 Sandwich
  { category: "Sandwich", name: "Masala Cheese Toast", description: "Thick street-style Masala Cheese Toast oozing with melted cheese and spicy green chutney.", price: 160 },
  { category: "Sandwich", name: "Bombay Paneer Tikka Grill", description: "Upscale Bombay grilled sandwich stuffed with spicy paneer tikka, perfectly toasted.", price: 210 },
  { category: "Sandwich", name: "Tandoori Chicken Club", description: "Triple-layered hearty club sandwich packed with roasted tandoori chicken, fried egg, and fresh veggies.", price: 250 },
  { category: "Sandwich", name: "Corn & Spinach Cheese Melt", description: "Creamy sweet corn and spinach mixed with mozzarella cheese, grilled inside multigrain bread.", price: 190 },
  { category: "Sandwich", name: "Spicy Aloo Club Sandwich", description: "Classic Indian potato filling seasoned perfectly with chaat masala, layered cucumbers, and tomatoes.", price: 150 },

  // 5 Cake
  { category: "Cake", name: "Chocolate Truffle Chai Cake", description: "Rich layered Chocolate Truffle Cake infused with Chai Spice.", price: 140 },
  { category: "Cake", name: "Mango Malai Sponge Slice", description: "Luxurious eggless Mango Malai sponge cake slice with saffron glaze.", price: 120 },
  { category: "Cake", name: "Cardamom Pistachio Bundt", description: "Moist buttery cake perfumed with green cardamom and generous amounts of ground pistachios.", price: 130 },
  { category: "Cake", name: "Red Velvet Choco Core", description: "Classic red velvet slice loaded with a surprising dark chocolate center and light cream cheese frosting.", price: 150 },
  { category: "Cake", name: "Caramel Walnut Fudge Cake", description: "Dense, chewy cake loaded with toasted walnuts and drowning in thick salted caramel syrup.", price: 145 },

  // 5 Pure Veg
  { category: "Pure Veg", name: "Creamy Palak Paneer Kofta", description: "Creamy Palak Paneer Kofta simmering in a rich green spinach curry.", price: 270 },
  { category: "Pure Veg", name: "Classic Copper Dal Makhani", description: "Rich, spicy classic Dal Makhani in a copper handi garnished with fresh cream.", price: 240 },
  { category: "Pure Veg", name: "Paneer Butter Masala", description: "Soft cottage cheese cubes cooked in a delightfully rich tomato and cashew base gravy.", price: 290 },
  { category: "Pure Veg", name: "Mushroom Matar Handi", description: "Fresh button mushrooms and green peas slowly cooked in a traditional clay pot rich gravy.", price: 260 },
  { category: "Pure Veg", name: "Navratan Korma", description: "Luxurious nine-gem curry featuring mixed vegetables, fruits, and nuts in a mild sweet cream sauce.", price: 310 },

  // 5 Pasta
  { category: "Pasta", name: "Makhani Penne Pasta", description: "Creamy Makhani Penne Pasta with roasted paneer cubes and parsley, upscale fusion cuisine.", price: 220 },
  { category: "Pasta", name: "Tandoori Chicken Alfredo", description: "Tandoori Chicken Alfredo Pasta, creamy sauce with vibrant orange tandoori spices and charred chicken.", price: 260 },
  { category: "Pasta", name: "Spicy Arrabbiata with Veggies", description: "Classic Italian hot tomato sauce tossed with penne, bell peppers, zucchini, and Indian chili flakes.", price: 190 },
  { category: "Pasta", name: "Pesto Paneer Fusilli", description: "Fusilli pasta coated in rich basil pesto and mixed with pan-fried cottage cheese cubes.", price: 230 },
  { category: "Pasta", name: "Creamy Mushroom Spaghetti", description: "White sauce spaghetti generously loaded with garlic-butter roasted button mushrooms and herbs.", price: 210 },

  // 5 Noodles
  { category: "Noodles", name: "Paneer Chili Garlic Noodles", description: "Paneer Chili Garlic Noodles in a traditional black wok, steam rising, sweet and spicy soy sauce.", price: 150 },
  { category: "Noodles", name: "Garlic Schezwan Hakka", description: "Spicy Garlic Schezwan Hakka Noodles wok-tossed with vibrant vegetables, steaming hot.", price: 140 },
  { category: "Noodles", name: "Chicken Manchurian Noodles", description: "Thick stir-fried noodles paired perfectly with crispy fried chicken bounds coated in Manchurian sauce.", price: 180 },
  { category: "Noodles", name: "Burnt Garlic Veg Noodles", description: "Classic savory noodles infused with an extreme punch of deeply roasted smoky garlic.", price: 130 },
  { category: "Noodles", name: "Singapore Curried Noodles", description: "Thin rice noodles stir-fried with vegetables and seasoned lightly with yellow Indian curry powder.", price: 160 },

  // 5 Chinese
  { category: "Chinese", name: "Dry Gobi Manchurian", description: "Crispy dry Gobi Manchurian tossed in soy-garlic glaze garnished with spring onions.", price: 190 },
  { category: "Chinese", name: "Veg Spring Rolls", description: "Golden crispy Veg Spring Rolls sliced diagonally, served with sweet hot garlic dipping sauce.", price: 160 },
  { category: "Chinese", name: "Sizzling Paneer Chili", description: "Crispy golden paneer cubes immersed in a thick, sweet and spicy soy-vinegar glaze studded with bell peppers.", price: 245 },
  { category: "Chinese", name: "Chicken Lollipop Dry", description: "Spicy, crispy batter-fried chicken wings served with fiery Schezwan dipping sauce.", price: 260 },
  { category: "Chinese", name: "Sweet & Sour Crispy Veg", description: "Assorted batter-fried vegetables glazed with an addictive sweet and bright red sour Chinese sauce.", price: 210 },
];

async function seed() {
  let successCount = 0;
  for (let i = 0; i < itemsToSeed.length; i++) {
    const item = itemsToSeed[i];
    
    // Fallback logic to grab alternating available images per category
    const catImages = images[item.category] || images['Chinese'];
    const imageFilename = catImages[i % catImages.length]; 
    const fullPath = path.join(ARTIFACT_DIR, imageFilename);
    const base64Image = fs.readFileSync(fullPath, 'base64');
    
    item.price = Number(item.price);
    item.imageData = `data:image/png;base64,${base64Image}`;

    try {
      const res = await fetch('http://localhost:4000/api/food/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const json = await res.json();
      if (json.success) {
        successCount++;
        console.log(`[✔] Added: ${item.name} (${item.category})`);
      } else {
        console.error(`[X] Error on ${item.name}: ${json.message}`);
      }
    } catch (e) {
      console.error(`[X] Failed ${item.name}: ${e.message}`);
    }
  }
  console.log(`\n🎉 Seeded ${successCount}/${itemsToSeed.length} items successfully!`);
}
seed();
