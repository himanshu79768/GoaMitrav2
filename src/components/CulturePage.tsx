import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPreferences, SavedPlaceItem } from '../types/onboarding';
import goaCulturalImg from '../assets/images/goa_cultural_tourism_1790841178468.jpg';

interface CulturalEventItem {
  id: string;
  name: string;
  month: 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';
  monthIndex: number; // 0 to 11
  location: string;
  dateDisplay: string;
  description: string;
  image: string;
  categoryBadge: string;
  badgeType?: 'bestMatch' | 'thisMonth' | 'featured' | 'traditional';
  tags: string[];
  audience?: string;
  activityType?: string;
}

interface CulturePageProps {
  preferences: UserPreferences;
  onBack: () => void;
  onOpenProfile?: () => void;
  onAskGAI: (initialPrompt?: string) => void;
  savedPlaces?: SavedPlaceItem[];
  onToggleSavePlace?: (place: SavedPlaceItem) => void;
}

const ALL_MONTHS = [
  { name: 'January', short: 'Jan', tag: 'Three Kings & Lokotsav', highlight: 'Feast of Three Kings, Bodgeshwar Zatra & Lokotsav' },
  { name: 'February', short: 'Feb', tag: 'Carnival & Temple Zatras', highlight: 'Goa Carnival, Mangeshi Zatra & Grape Escapade' },
  { name: 'March', short: 'Mar', tag: 'Shigmo & Ghodemodni', highlight: 'Shigmotsav, Holi, Ghodemodni & All Saints Procession' },
  { name: 'April', short: 'Apr', tag: 'Easter & Milagres Feast', highlight: 'Easter, Milagres Feast, Gulalotsav & Gudi Padwa' },
  { name: 'May', short: 'May', tag: 'Shirgao Fire-Walking Zatra', highlight: 'Shirgao Lairai Fire-Walking & Cashew Festival' },
  { name: 'June', short: 'Jun', tag: 'São João & River Sangodd', highlight: 'São João Water Festival & Sangodd Boat Pageants' },
  { name: 'July', short: 'Jul', tag: 'Chikhal Kalo & Cucumber Fest', highlight: 'Chikhal Kalo Mud Fest & Cucumber Festival' },
  { name: 'August', short: 'Aug', tag: 'Bonderam & Vasco Saptah', highlight: 'Bonderam Flag Fest, Vasco Saptah & Matoli Market' },
  { name: 'September', short: 'Sep', tag: 'Chavath & Tiatr Festival', highlight: 'Chavath / Ganesh Chaturthi & State Tiatr Competition' },
  { name: 'October', short: 'Oct', tag: 'Navratri & Colva Fama', highlight: 'Navratri, Colva Fama & Narkasur Effigy Parades' },
  { name: 'November', short: 'Nov', tag: 'Tripurari & IFFI / Serendipity', highlight: 'Tripurari Poornima Boat Fest, IFFI & Serendipity Arts' },
  { name: 'December', short: 'Dec', tag: 'St. Francis Feast & Christmas', highlight: 'Feast of St. Francis Xavier, Immaculate Conception & Christmas' },
];

const MONTHLY_CULTURAL_TIPS: Record<number, string> = {
  0: "January Cultural Tip: Visit Cansaulim Hill early on Jan 6th for the 400-year-old Three Kings Procession, and savor authentic Goan Khaje sweets at Mapusa's Bodgeshwar Zatra!",
  1: "February Cultural Tip: King Momo decrees 4 days of non-stop joy! Catch float parades in Panaji on Day 1, followed by Margao & Mapusa. Don't miss the 24-hr Mangeshi Zatra!",
  2: "March Cultural Tip: Shigmo parades feature massive illuminated mythological floats and Romtamel drumming. Arrive by 4:00 PM in Panaji or Ponda for front-row views!",
  3: "April Cultural Tip: Devotees offer coconut oil at Mapusa Milagres Feast regardless of faith — a world-famous symbol of Goan communal harmony.",
  4: "May Cultural Tip: Witness the intense midnight Homkhand fire-walking at Shirgao Lairai Zatra, and attend the Panaji Cashew Festival for GI-tagged Feni tastings!",
  5: "June Cultural Tip: Don fresh flower Kopel crowns during São João on June 24! Join Siolim river boat pageants and watch festive village well-jumping.",
  6: "July Cultural Tip: Wear comfortable old clothes for Marcel's Chikhal Kalo mud festival — sacred sesame oil is distributed freely before traditional mud sports!",
  7: "August Cultural Tip: Divar Island's Bonderam festival features Fotash bamboo toy cannons and brass parades. Take the Ribandar ferry early to avoid rush!",
  8: "September Cultural Tip: Walk through village homes in Marcel and Priol to observe intricate Matoli ceiling canopies woven with 100+ wild forest fruits and medicinal herbs.",
  9: "October Cultural Tip: Witness giant paper-mâché Narkasur effigies burned across Goan towns on Diwali eve, and visit Colva Church for the historic Fama procession!",
  10: "November Cultural Tip: Head to the Valvanti riverbank in Sanquelim on Tripurari Poornima to watch lit handcrafted miniature boat models float at dusk.",
  11: "December Cultural Tip: Visit Old Goa Basilica on Dec 3rd for St. Francis Xavier's feast High Mass, and stroll Fontainhas Latin Quarter for lit Christmas star lanterns.",
};

// Complete Dataset covering ALL events provided in user prompt (Jan - Dec)
export const CULTURAL_EVENTS: CulturalEventItem[] = [
  // --- JANUARY ---
  {
    id: 'jan-1',
    name: 'Feast of the Three Kings (Festa dos Reis)',
    month: 'January',
    monthIndex: 0,
    location: 'Cansaulim, Chandor & Reis Magos',
    dateDisplay: '06 Jan · 8:00 AM',
    description: '400-year-old sacred procession where three young boys dressed as royal kings ride horses up the hilltop chapel of Our Lady of the Mount.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDINnxoK1of-qZZv1-7dOC-zOaj8_DYthnZQt3mUlT7A&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'featured',
    tags: ['400-Yr Procession', 'Horse Parade', 'Cansaulim Hill'],
    activityType: 'Traditional Procession',
    audience: 'Family-friendly'
  },
  {
    id: 'jan-2',
    name: 'Bodgeshwar Zatra (Bongini Zatra)',
    month: 'January',
    monthIndex: 0,
    location: 'Mapusa, North Goa',
    dateDisplay: 'Mid January · 6:00 PM',
    description: 'Vibrant annual temple fair dedicated to Lord Bodgeshwar, believed to fulfill vows. Features sweet stalls, brass bands, and night processions.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3IRJnFXpjQMbi2415iBFYKencYNEi9WU5h-nYRBmn1Q&s=10',
    categoryBadge: 'Temple Zatra',
    badgeType: 'thisMonth',
    tags: ['Mapusa Night Fair', 'Khaje Sweets', 'Brass Bands'],
    activityType: 'Night Fair',
    audience: 'Local & Visitors'
  },
  {
    id: 'jan-3',
    name: 'Shantadurga Kunkallikarin Zatra',
    month: 'January',
    monthIndex: 0,
    location: 'Fatorpa / Cuncolim, South Goa',
    dateDisplay: 'January (Paush Month) · All Day',
    description: 'Massive annual temple zatra of Goddess Shantadurga Kunkallikarin, drawing thousands of devotees for night chariot processions.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTai-En8N4dxetUtdEqqeItgKPH3mxvirciqmaKrmtTFQ&s=10',
    categoryBadge: 'Temple Zatra',
    badgeType: 'traditional',
    tags: ['Chariot Parade', 'Fatorpa Shrine', 'Devotional Fair'],
    activityType: 'Chariot Festival',
    audience: 'Devotees & Tourists'
  },
  {
    id: 'jan-4',
    name: 'St. Joseph Vaz Feast',
    month: 'January',
    monthIndex: 0,
    location: 'Sancoale Sanctuary',
    dateDisplay: '16 January · 8:00 AM',
    description: 'Feast of the Apostle of Sri Lanka and Goa at his sanctuary in Sancoale, featuring High Mass and pilgrims from across Konkan.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhqPymcc54soY20r4fhNhgGhWM4jue2JHrP31XaWEIVA&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Sancoale Sanctuary', 'High Mass', 'Pilgrimage'],
    activityType: 'Holy Mass',
    audience: 'Pilgrims'
  },
  {
    id: 'jan-5',
    name: 'Lokotsav National Folk Arts & Crafts Fair',
    month: 'January',
    monthIndex: 0,
    location: 'D.K. Maidan, Panaji',
    dateDisplay: 'Late January · 10:00 AM',
    description: 'Goa’s largest national folk arts assembly featuring over 500 artisans, traditional handicraft stalls, Ghumot percussion, and Konkan food courts.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc8gog_WucG_YaTa-ug1yoxxT3ER__EMUnkkJtUnTQVg&s=10',
    categoryBadge: 'Folk & Crafts',
    badgeType: 'bestMatch',
    tags: ['Handicraft Stalls', 'Folk Dance', 'Food Courts'],
    activityType: 'Crafts Exhibition',
    audience: 'All Ages'
  },
  {
    id: 'jan-6',
    name: 'Kirtan Mahotsav',
    month: 'January',
    monthIndex: 0,
    location: 'Panaji & Ponda',
    dateDisplay: 'January · 5:00 PM',
    description: 'Festival of devotional Kirtan singing, spiritual discourses, and classical Indian percussion across Goan temple halls.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrDFtWz9qdk8-Yfnsvoi_we8cA7Rd0eAWjI7-GTFvV6w&s=10',
    categoryBadge: 'Music & Classical',
    tags: ['Kirtan Singing', 'Devotional Music', 'Temple Halls'],
    activityType: 'Devotional Vocal',
    audience: 'Spiritual Seekers'
  },
  {
    id: 'jan-7',
    name: 'Bhakti Sangeet Samaroh',
    month: 'January',
    monthIndex: 0,
    location: 'Margao & Panaji',
    dateDisplay: 'January · 6:30 PM',
    description: 'Evening of soul-stirring devotional music, bhajans, and abhangas performed by renowned Goan and national vocalists.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx5C1cJ9iiibf1tP98mXLAn1p-iBknSgNHzLY66i_yfQ&s=10',
    categoryBadge: 'Music & Classical',
    tags: ['Devotional Vocal', 'Bhajans', 'Ravindra Bhavan'],
    activityType: 'Classical Concert',
    audience: 'Music Lovers'
  },
  {
    id: 'jan-8',
    name: 'Classical Dance Festival',
    month: 'January',
    monthIndex: 0,
    location: 'Kala Academy, Panaji',
    dateDisplay: 'January · 6:00 PM',
    description: 'Showcase of Kathak, Bharatanatyam, and Odissi classical dance performances along the Mandovi riverfront.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSwK4o9FMKF_ZtU18noTzOR9uzf-VUTvt2ailhcqUwAA&s=10',
    categoryBadge: 'Music & Classical',
    tags: ['Kathak & Odissi', 'Kala Academy', 'Mandovi Stage'],
    activityType: 'Dance Recital',
    audience: 'Art Enthusiasts'
  },
  {
    id: 'jan-9',
    name: 'Abhijat Sangeet Natak Mahotsav',
    month: 'January',
    monthIndex: 0,
    location: 'Panaji, North Goa',
    dateDisplay: 'January · 7:00 PM',
    description: 'Classical Konkani and Marathi musical play festival preserving traditional regional theatre arts.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpa7PMD7ZVZrM_9yIT5bYez2dqoMdyeW0zU_kxUpTP7w&s=10',
    categoryBadge: 'Theatre & Art',
    tags: ['Musical Drama', 'Konkani Theatre', 'Stage Heritage'],
    activityType: 'Musical Play',
    audience: 'Theatre Goers'
  },
  {
    id: 'jan-10',
    name: 'State Art Exhibition',
    month: 'January',
    monthIndex: 0,
    location: 'Kala Academy Gallery, Panaji',
    dateDisplay: 'January · 10:00 AM',
    description: 'Annual state exhibition highlighting contemporary paintings, sculptures, and installations by Goan artists.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrlZfzEp-frjkMM6Bh1yLXkWYDVsxLg9GNsYo99V9sXw&s',
    categoryBadge: 'Theatre & Art',
    tags: ['Visual Arts', 'Goan Painters', 'Gallery Walk'],
    activityType: 'Art Gallery',
    audience: 'Cultural Visitors'
  },
  {
    id: 'jan-11',
    name: 'Republic Day Cultural Programmes',
    month: 'January',
    monthIndex: 0,
    location: 'Campal Grounds, Panaji',
    dateDisplay: '26 January · 8:30 AM',
    description: 'State parade, folk dance troupes, school cultural presentations, and patriotic music pageantry.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR02B62izfRNM9M0LOJrByIyFW85i3Qan3ChJAPdvW4Xg&s=10',
    categoryBadge: 'Civic Cultural',
    tags: ['State Parade', 'Folk Troupes', 'Campal Panaji'],
    activityType: 'Cultural Parade',
    audience: 'General Public'
  },
  {
    id: 'jan-12',
    name: 'Temple Jatras in Paush Month',
    month: 'January',
    monthIndex: 0,
    location: 'Various Village Temples across Goa',
    dateDisplay: 'Throughout January',
    description: 'Sacred temple palanquin processions (Palkhi) and night fairs celebrating local village deities.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJKJOhG4DZ0dvLguUK1xiNpb1FyhKcgvceAigPxB_nNw&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Palkhi Parade', 'Village Temples', 'Night Bazaars'],
    activityType: 'Palanquin Parade',
    audience: 'Community'
  },

  // --- FEBRUARY ---
  {
    id: 'feb-1',
    name: 'Goa Carnival / Carnaval Float Parades',
    month: 'February',
    monthIndex: 1,
    location: 'Panaji, Margao, Mapusa & Vasco',
    dateDisplay: 'February · 4:00 PM',
    description: 'Goa’s iconic 4-day festival decreed by King Momo. Features colorful float parades, samba dancers, brass bands, and street theatre.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREBoe9l8JFGfKZ-YZFhSRzVZ0z4ftxmgOvh8cp5nTNDA&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['King Momo', 'Samba Floats', 'Brass Bands'],
    activityType: 'Float Parade',
    audience: 'Family & Carnival Fans'
  },
  {
    id: 'feb-2',
    name: 'Shigmo / Shigmotsav (Early Season)',
    month: 'February',
    monthIndex: 1,
    location: 'Ponda, Bicholim & Panaji',
    dateDisplay: 'Late February · 5:00 PM',
    description: 'Beginning of the Shigmo spring season with folk dance rehearsals, Ghodemodni preparations, and temple rituals.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb6X1F_wtLac4HbNrGW9qN8v01gCDAzUD9qltv3o0qqQ&s=10',
    categoryBadge: 'Folk & Culture',
    badgeType: 'traditional',
    tags: ['Shigmo Drums', 'Folk Rehearsals', 'Spring Festival'],
    activityType: 'Folk Dance',
    audience: 'Cultural Seekers'
  },
  {
    id: 'feb-3',
    name: 'Gulalotsav',
    month: 'February',
    monthIndex: 1,
    location: 'Zambaulim & Ponda Temples',
    dateDisplay: 'February / March · 3:00 PM',
    description: 'Vibrant pink gulal powder festival showering color over temple deities and devotees in ecstatic devotional dancing.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr7EoLfrAmm6lg-sR8ior7AMSUAQ6tENRgZOXdaNt3bA&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Pink Gulal Powder', 'Damodar Temple', 'Devotional Dance'],
    activityType: 'Color Ritual',
    audience: 'Devotees'
  },
  {
    id: 'feb-4',
    name: 'Mahashivratri Celebrations',
    month: 'February',
    monthIndex: 1,
    location: 'Harvalem, Mangueshi & Nagueshi',
    dateDisplay: 'February / March · All Night',
    description: 'All-night vigilance, milk abhishekam, and devotional chanting across ancient Shiva shrines in Ponda and Harvalem.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH_E9qsYGMqvfKRETAL7RC0nqWnbbYdulZtfioE4o7dQ&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['All-Night Prayer', 'Mangueshi Shrine', 'Shiva Abhishekam'],
    activityType: 'Night Vigil',
    audience: 'Spiritual Seekers'
  },
  {
    id: 'feb-5',
    name: 'Mangeshi Temple Zatra',
    month: 'February',
    monthIndex: 1,
    location: 'Mangeshi Temple, Priol',
    dateDisplay: 'February · 7:00 PM',
    description: 'Annual night fair and chariot procession of Lord Mangesh amidst traditional brass music, oil lamps, and fireworks.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE5ywwcKnWy4tJ_UYAmL2yVih9ax5XpUyGBuzGJKHFZw&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Mangeshi Chariot', 'Oil Lamps', 'Night Fair'],
    activityType: 'Chariot Parade',
    audience: 'Family-friendly'
  },
  {
    id: 'feb-6',
    name: 'Nagueshi & Ramnathi Temple Celebrations',
    month: 'February',
    monthIndex: 1,
    location: 'Bandora & Ramnathi, Ponda',
    dateDisplay: 'February · 6:00 PM',
    description: 'Ancient temple festivals with sacred water tank reflections, devotional bhajans, and communal prasadam feasts.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcCztd_GWQnrvXGJCh4Y4MNAF4S_FFE3Eh80Zb1nSfQ&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Sacred Water Tank', 'Ponda Temples', 'Bhajan Vocal'],
    activityType: 'Temple Festival',
    audience: 'Local & Visitors'
  },
  {
    id: 'feb-7',
    name: 'Mahalasa / Vijayarathotsav',
    month: 'February',
    monthIndex: 1,
    location: 'Mardol, Ponda',
    dateDisplay: 'February · 8:00 PM',
    description: 'Majestic victory chariot procession of Goddess Mahalasa Narayani surrounded by thousands of devout followers.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkuXJ4BFDDbgcT929BiAc6R6O9a7WnJR7gO7yNol2o0A&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Rathotsav Chariot', 'Mardol Shrine', 'Devotional Procession'],
    activityType: 'Victory Chariot',
    audience: 'Devotees'
  },
  {
    id: 'feb-8',
    name: 'Rantha Saptami',
    month: 'February',
    monthIndex: 1,
    location: 'Mallikarjun Temple, Canacona',
    dateDisplay: 'February · 7:00 AM',
    description: 'Sun worship celebrations and ancient ritual dances in South Goa’s Canacona taluka.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCtNOe1n8yZnd6v5h1X0rolWWt5qSX3gSGfZN51jdWdg&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Sun Worship', 'Canacona Temple', 'Tribal Rituals'],
    activityType: 'Ritual Worship',
    audience: 'Culture Lovers'
  },
  {
    id: 'feb-9',
    name: 'Feast of Our Lady of Candelaria',
    month: 'February',
    monthIndex: 1,
    location: 'Pomburpa Church',
    dateDisplay: 'February · 8:30 AM',
    description: 'Candlemas parish feast with blessing of candles, High Mass, and traditional brass orchestra.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQDMZZn0ku1o1sy4eWHapHDQF17fM9ZBRAhCSDD8r65g&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Candlemas Blessing', 'Pomburpa', 'Parish Mass'],
    activityType: 'Parish Feast',
    audience: 'Community'
  },
  {
    id: 'feb-10',
    name: 'Urus of Shah Abdullah',
    month: 'February',
    monthIndex: 1,
    location: 'Ponda Dargah',
    dateDisplay: 'February · 6:00 PM',
    description: 'Sufi shrine urs festival bringing together multi-faith devotees with Qawwali music and communal meals.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWQ7krLqCUefG6WcUw_RWLBhYTRuoMu7twPpO-Eqauyg&s=10',
    categoryBadge: 'Interfaith',
    tags: ['Qawwali Singing', 'Ponda Dargah', 'Community Feast'],
    activityType: 'Sufi Qawwali',
    audience: 'Interfaith'
  },
  {
    id: 'feb-11',
    name: 'Grape Escapade & Food Festival',
    month: 'February',
    monthIndex: 1,
    location: 'Panaji & Margao',
    dateDisplay: 'Late February · 6:30 PM',
    description: 'Premier culinary and lifestyle gala with wine tasting, grape stomping, live jazz bands, and Goan food stalls.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIrf9RW1TXxuHM7KicOyWhKniK5yaaCNAWcSLdrO4uUQ&s=10',
    categoryBadge: 'Food & Crafts',
    tags: ['Wine Tasting', 'Live Jazz', 'Goan Cuisine'],
    activityType: 'Culinary Gala',
    audience: 'Foodies'
  },
  {
    id: 'feb-12',
    name: 'Shiv Jayanti Celebrations',
    month: 'February',
    monthIndex: 1,
    location: 'Porvorim & Panaji',
    dateDisplay: '19 February · 4:00 PM',
    description: 'Historical tableaus, traditional Lezim dance, and martial arts demonstrations honoring Chhatrapati Shivaji Maharaj.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ZohgtUEinkKJLeY-9VIEiE4zMqEmchReKm2P5cKlKw&s=10',
    categoryBadge: 'Folk & Culture',
    tags: ['Historical Floats', 'Lezim Dance', 'Porvorim'],
    activityType: 'Historical Tableau',
    audience: 'Family-friendly'
  },

  // --- MARCH ---
  {
    id: 'mar-1',
    name: 'Shigmo / Shigmotsav Float Parades',
    month: 'March',
    monthIndex: 2,
    location: 'Panaji, Margao, Mapusa, Ponda, Bicholim',
    dateDisplay: 'March · 4:30 PM',
    description: 'The grand Goan Hindu spring festival featuring massive illuminated floats depicting Indian epics, Romtamel drumming, and Fugdi folk dancers.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMjd4DPjAAYrrAXjfidbqqsRFKE_K48TaB0DS-FOvzlQ&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Mythological Floats', 'Romtamel Drums', 'Fugdi Dance'],
    activityType: 'Folk Parade',
    audience: 'All Ages'
  },
  {
    id: 'mar-2',
    name: 'Holi / Dhulvad & Gulal Utsav',
    month: 'March',
    monthIndex: 2,
    location: 'Zambaulim & Across Goa',
    dateDisplay: 'March · 10:00 AM',
    description: 'Spring festival of colors with herbal gulal powder, rain dances, and traditional sweet delicacies across towns.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyiyOxy5L9M7bbfX7UmlTX-9GGVAc6wNkYVmM0CT7RLg&s=10',
    categoryBadge: 'Folk & Culture',
    badgeType: 'thisMonth',
    tags: ['Color Festival', 'Organic Gulal', 'Zambaulim'],
    activityType: 'Color Play',
    audience: 'Family & Youth'
  },
  {
    id: 'mar-3',
    name: 'Ghodemodni Warrior Horse Parade',
    month: 'March',
    monthIndex: 2,
    location: 'Bicholim & Sanquelim',
    dateDisplay: 'March · 5:00 PM',
    description: 'Spectacular martial folk dance where wooden-horse clad dancers wielding swords recreate the victory dances of Rane Maratha warriors.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1KG0-JOYZKpByWMsRP_WxoTQ7ZAiKzW1bAd6WqT1ng&s=10',
    categoryBadge: 'Folk & Culture',
    badgeType: 'featured',
    tags: ['Horse Dancers', 'Rane Warriors', 'Swords'],
    activityType: 'Martial Folk Dance',
    audience: 'Heritage Buffs'
  },
  {
    id: 'mar-4',
    name: 'Ranmale Traditional Mask Theatre',
    month: 'March',
    monthIndex: 2,
    location: 'Sattari & Sanguem Villages',
    dateDisplay: 'March · 8:00 PM',
    description: 'Ancient forest folk theatre and dance-drama performed in Sattari using wooden masks, drums, and Konkani folklore.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRHvoC6WZlx7kqIvEpjEove-lSjHkoW3woteikb8R07w&s=10',
    categoryBadge: 'Theatre & Art',
    tags: ['Wooden Masks', 'Sattari Forest', 'Folk Theatre'],
    activityType: 'Mask Drama',
    audience: 'Folklore Enthusiasts'
  },
  {
    id: 'mar-5',
    name: 'Procession of All Saints (Franciscan Third Order)',
    month: 'March',
    monthIndex: 2,
    location: 'Old Goa (Velha Goa)',
    dateDisplay: 'March · 4:00 PM',
    description: 'The only procession of its kind outside Rome: 31 life-size statues of Franciscan saints carried on decorated palanquins through Old Goa.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYGbg0X8jMa6NcuEPn7RkkJUvMEtvqXR58t27mtqjmWg&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'traditional',
    tags: ['31 Saint Statues', 'Old Goa', '300-Yr Procession'],
    activityType: 'Sacred Parade',
    audience: 'History & Pilgrims'
  },
  {
    id: 'mar-6',
    name: 'Gades Festival of Sal',
    month: 'March',
    monthIndex: 2,
    location: 'Sal, Bicholim',
    dateDisplay: 'March · 10:00 PM',
    description: 'Mystical village ritual where chosen villagers enter a trance state to search for sacred hidden objects in dark surrounding forests.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh7WdRPqYeWOnei5cnS7x0zp4ru-xNOj8LI7a_ZqvJRw&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Trance Ritual', 'Sal Village', 'Forest Heritage'],
    activityType: 'Mystic Ritual',
    audience: 'Culture Researchers'
  },
  {
    id: 'mar-7',
    name: 'Rang Panchami & Chaitra Temple Festivals',
    month: 'March',
    monthIndex: 2,
    location: 'Ponda & Mapusa Temples',
    dateDisplay: 'March · 4:00 PM',
    description: 'Fifth-day color celebrations and spring full-moon temple palanquin pageants with classical bhajan singing.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD37nCtqDLk-empssUJnjpYOA0RLbpXSPJjLRtKD0OCQ&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Chaitra Moon', 'Palanquin Parade', 'Ponda Shrines'],
    activityType: 'Moonlight Pageant',
    audience: 'Devotees'
  },
  {
    id: 'mar-8',
    name: 'Dindi Devotional Processions',
    month: 'March',
    monthIndex: 2,
    location: 'Margao & Quepem',
    dateDisplay: 'March · 6:00 PM',
    description: 'Devotional singing processions honoring Lord Vithal with mridangam percussion, cymbals, and palanquins.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOVmuvEjGsU7Cjg9ZTSs5x4RH0tJRh6qHFmqZR-0wYiQ&s=10',
    categoryBadge: 'Folk & Culture',
    tags: ['Dindi Songs', 'Lord Vithal', 'Margao Town'],
    activityType: 'Chanting Procession',
    audience: 'Community'
  },
  {
    id: 'mar-9',
    name: 'International Jazz Festival & Cultural Music Events',
    month: 'March',
    monthIndex: 2,
    location: 'Panaji Riverfront',
    dateDisplay: 'March · 7:00 PM',
    description: 'Open-air riverside jazz concerts bringing together Indian fusion musicians and international jazz quartets.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbqQuGFSSsTSI4tlmKldUPJngqUePnxjskKGEXrQWWbg&s=10',
    categoryBadge: 'Music & Classical',
    tags: ['Riverside Jazz', 'Fusion Jam', 'Panaji Stage'],
    activityType: 'Live Music Concert',
    audience: 'Music Lovers'
  },

  // --- APRIL ---
  {
    id: 'apr-1',
    name: 'Easter & Good Friday Services',
    month: 'April',
    monthIndex: 3,
    location: 'Churches Across Goa',
    dateDisplay: 'April · Morning & Evening',
    description: 'Solemn Passion plays on Good Friday followed by joyful Easter Sunday resurrection masses, sorpotel family feasts, and choir music.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxGf-XcWwToTdmUqBHYOVyErr-BPtntQoGKwYWVqIpVw&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'bestMatch',
    tags: ['Resurrection Mass', 'Passion Play', 'Family Feasts'],
    activityType: 'Holy Mass & Choir',
    audience: 'Family-friendly'
  },
  {
    id: 'apr-2',
    name: 'Feast of Jesus of Nazareth',
    month: 'April',
    monthIndex: 3,
    location: 'Siridao Beach Church',
    dateDisplay: 'April · 8:00 AM',
    description: 'Coastal parish feast featuring seaside High Mass, village brass orchestra, and beachside food stalls.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIWtkXZPkAqFpbqQBJ2SDt0-LRtqE6XIJBmS2KjKMw-A&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Seaside Church', 'Siridao Beach', 'Brass Music'],
    activityType: 'Coastal Feast',
    audience: 'Parishioners & Visitors'
  },
  {
    id: 'apr-3',
    name: 'Feast of Our Lady of Miracles (Milagres Saibinn)',
    month: 'April',
    monthIndex: 3,
    location: 'St. Jerome Church, Mapusa',
    dateDisplay: 'April · 8:00 AM',
    description: 'Renowned interfaith festival where both Hindu and Christian devotees offer coconut oil and flowers to Milagres Saibinn.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUJLtKu6UwO-aNbY-TwoxRb423BCVKJElzO0eee--sbA&s=10',
    categoryBadge: 'Interfaith',
    badgeType: 'featured',
    tags: ['Interfaith Unity', 'Coconut Oil Offerings', 'Mapusa Feast'],
    activityType: 'Interfaith Worship',
    audience: 'All Faiths'
  },
  {
    id: 'apr-4',
    name: 'Gulalotsav of Zambaulim',
    month: 'April',
    monthIndex: 3,
    location: 'Shri Damodar Temple, Zambaulim',
    dateDisplay: 'April · 3:00 PM',
    description: 'Ecstatic magenta gulal powder shower over Lord Damodar and thousands of gathered devotees in South Goa.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe6mNssZqa-G6XW_Vp-PmadqDirLeqELgJDtq3lo65DQ&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Magenta Powder', 'Zambaulim Damodar', 'Devotional Joy'],
    activityType: 'Color Celebration',
    audience: 'Devotees'
  },
  {
    id: 'apr-5',
    name: 'Gudi Padwa / Samvatsar Padvo',
    month: 'April',
    monthIndex: 3,
    location: 'Across Homes & Temples in Goa',
    dateDisplay: 'April · Sunrise',
    description: 'Traditional Hindu New Year with Gudi flag hoisting outside homes, neem-jaggery prasad, and festive family lunches.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4W0GeJAGkllda21XLuB5owAnq9-EMRuSzL1NeMSItWg&s=10',
    categoryBadge: 'Major Festival',
    tags: ['Hindu New Year', 'Gudi Flags', 'Family Feast'],
    activityType: 'New Year Ritual',
    audience: 'Family-friendly'
  },
  {
    id: 'apr-6',
    name: 'Ram Navami at Partagal Math',
    month: 'April',
    monthIndex: 3,
    location: 'Partagal Math, Canacona',
    dateDisplay: 'April · 12:00 PM',
    description: 'Sacred birth celebration of Lord Rama at the ancient Gokarna Partagali Math with Vedic chants, math prasad, and palanquins.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKKYK2Vp9sI_mNbhN8NHGemP4GpRTmBRULp5T92s-w0Q&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Partagal Math', 'Vedic Chants', 'Canacona'],
    activityType: 'Vedic Chanting',
    audience: 'Devotees'
  },
  {
    id: 'apr-7',
    name: 'Goa Heritage & Spirit Festival',
    month: 'April',
    monthIndex: 3,
    location: 'Fontainhas, Panaji & Saligao',
    dateDisplay: 'April · 5:00 PM',
    description: 'Heritage walks through Portuguese Latin Quarters, azulejos tile exhibitions, fado singing, and Goan craft markets.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7Hz9EhqBPuSd7qDxX13kDGkYh2aMmEmqfm5Pw1v73uQ&s=10',
    categoryBadge: 'Folk & Culture',
    tags: ['Fontainhas Walk', 'Azulejos Tiles', 'Fado Songs'],
    activityType: 'Guided Walk & Music',
    audience: 'Culture Travelers'
  },
  {
    id: 'apr-8',
    name: 'Hanuman Jayanti & Virabhadra Festival',
    month: 'April',
    monthIndex: 3,
    location: 'Panaji, Mapusa & Sanquelim',
    dateDisplay: 'April · Evening',
    description: 'Devotional Hanuman Chalisa recitations, martial sword dances, and village temple night processions.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK919PSd0nxlWOFZs3AWfKGs8L8tbguwKzMsnCtLeQ4w&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Hanuman Shrines', 'Sword Dance', 'Mahaprasad'],
    activityType: 'Sword Dance & Chants',
    audience: 'Local Community'
  },

  // --- MAY ---
  {
    id: 'may-1',
    name: 'Shirgao Lairai Zatra & Homkhand Fire-Walking',
    month: 'May',
    monthIndex: 4,
    location: 'Shirgao, Bicholim, North Goa',
    dateDisplay: 'May · 10:00 PM',
    description: 'One of Goa’s most intense spiritual events: thousands of Dhond devotees dressed in white walk barefoot over glowing hot charcoal embers.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7IVGNLjuLUMr9aBgriWWTEkddv0D0VPL90ZMJEQ2h0A&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Fire-Walking', 'Dhond Devotees', 'Sacred Embers'],
    activityType: 'Fire-Walking Ritual',
    audience: 'Spectators & Pilgrims'
  },
  {
    id: 'may-2',
    name: 'Kurdi Zatra / Someshwar Submerged Temple Zatra',
    month: 'May',
    monthIndex: 4,
    location: 'Kurdi / Sanguem',
    dateDisplay: 'May · 9:00 AM',
    description: 'Annual pilgrimage to the ancient 12th-century Someshwar temple that emerges from Sanguem dam waters only during summer May heat.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCwmtuEmOqZGDVmF-nIgS-rz2hEocCibo5qGTl8G7tGw&s=10',
    categoryBadge: 'Temple Zatra',
    badgeType: 'featured',
    tags: ['Submerged Temple', 'Sanguem Dam', 'Ancient Heritage'],
    activityType: 'Archaeological Pilgrimage',
    audience: 'History & Nature'
  },
  {
    id: 'may-3',
    name: 'Gad Yanchi Procession & Narasimha Festival',
    month: 'May',
    monthIndex: 4,
    location: 'Poinguinim & Veling',
    dateDisplay: 'May · 5:00 PM',
    description: 'Traditional village banners procession in Canacona and theatrical depictions of Lord Narasimha in Veling.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLC6qu5D3UzkvfaKaBFKQxplwTgfh5dpU9v4LP_Uj-lw&s',
    categoryBadge: 'Temple Zatra',
    tags: ['Village Banners', 'Narasimha Play', 'Canacona'],
    activityType: 'Mythological Play',
    audience: 'Local Villagers'
  },
  {
    id: 'may-4',
    name: 'Feast of Mae de Deus',
    month: 'May',
    monthIndex: 4,
    location: 'Saligao Church',
    dateDisplay: 'May · 8:30 AM',
    description: 'Feast of the Mother of God at the iconic illuminated Neo-Gothic Saligao Church with village brass bands.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2BhIKYc0kk8-_85ZtMvKcQXE4Iueh7y_ow9wZ4SszMw&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Neo-Gothic Church', 'Saligao', 'Illuminated Tower'],
    activityType: 'Illuminated Feast',
    audience: 'Family-friendly'
  },
  {
    id: 'may-5',
    name: 'Goa Cashew & Coconut Heritage Festival',
    month: 'May',
    monthIndex: 4,
    location: 'Bandodkar Ground, Panaji',
    dateDisplay: 'May · 10:00 AM',
    description: 'Celebrating Goa’s GI-tagged cashew feni with live distillation demos, cocktail masterclasses, and Konkani pop concerts.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShUGkOffva5XgdeqTx4BWq58QBrTqwaftq1Frf6ITxzQ&s=10',
    categoryBadge: 'Food & Crafts',
    badgeType: 'thisMonth',
    tags: ['Cashew Feni Demo', 'Cocktail Show', 'Local Music'],
    activityType: 'Feni Distillation & Music',
    audience: 'Culinary Travelers'
  },
  {
    id: 'may-6',
    name: 'Konkan Fruit Festival',
    month: 'May',
    monthIndex: 4,
    location: 'Campal Promenade, Panaji',
    dateDisplay: 'May · 10:00 AM',
    description: 'Exhibition of rare tropical fruits, Mankurad mango tasting, jackfruit products, and organic Konkan farmer markets.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzzkvOSxJK0jKZpnVhy80Nm5Ozo6VbC8-KBVTv_s7Adw&s=10',
    categoryBadge: 'Food & Crafts',
    tags: ['Mankurad Mangoes', 'Jackfruit Crafts', 'Organic Market'],
    activityType: 'Tropical Fruit Tasting',
    audience: 'Foodies & Families'
  },

  // --- JUNE ---
  {
    id: 'june-1',
    name: 'São João Water Festival & Kopel Crowns',
    month: 'June',
    monthIndex: 5,
    location: 'Siolim, Benaulim, Baga & Candolim',
    dateDisplay: '24 June · 2:00 PM',
    description: 'World-famous monsoon festival celebrating St. John the Baptist. Villagers wear fresh flower crowns (Kopels) and leap into wells and rivers.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2lmggwUizhKjGwo3CvtENbZyKsz7ObPi4AHgocMbIdg&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Kopel Flower Crowns', 'Well Jumping', 'Siolim Boat Stage'],
    activityType: 'Water Festival',
    audience: 'Youth & Travelers'
  },
  {
    id: 'june-2',
    name: 'Sangodd Fisherfolk River Boat Festival',
    month: 'June',
    monthIndex: 5,
    location: 'Candolim, Orda & Assolna Rivers',
    dateDisplay: '29 June · 3:30 PM',
    description: 'Fishermen tie fishing canoes together to build floating stages, performing folk plays, choir songs, and brass instrumentals along the river.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1UKL99sphWUIwfXOuUYxNDdwwarQlyuU44akbvNQ0Vg&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'featured',
    tags: ['Tied Canoes', 'Floating River Stage', 'Fisherfolk Choir'],
    activityType: 'Floating River Stage',
    audience: 'Family-friendly'
  },
  {
    id: 'june-3',
    name: 'Feast of the Sacred Heart & Monsoon Feasts',
    month: 'June',
    monthIndex: 5,
    location: 'Parishes Across Goa',
    dateDisplay: 'Throughout June',
    description: 'Welcoming the Konkan monsoon with parish masses, piping hot Goan rain snacks, and family gatherings.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLahC6i5S0BkFKTgy35Pje053LLR7eoE65QqxJEvcZHg&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Monsoon Mass', 'Rain Snacks', 'Family Reunions'],
    activityType: 'Parish Community Mass',
    audience: 'Local Parishes'
  },

  // --- JULY ---
  {
    id: 'jul-1',
    name: 'Chikhal Kalo Mud Festival (Krishna Leela)',
    month: 'July',
    monthIndex: 6,
    location: 'Devaki Krishna Temple Grounds, Marcel',
    dateDisplay: 'July · 2:00 PM',
    description: 'Ancient 400-year-old Goan mud festival celebrating Lord Krishna’s childhood games. Devotees smear sesame oil and play sports in natural mud.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYJQrRdkKQXenIyIv9lTNbj1SSv2NopjVcVOE8NFDAHg&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Sacred Mud Games', 'Krishna Leela', 'Marcel Village'],
    activityType: 'Mud Games Ritual',
    audience: 'All Ages'
  },
  {
    id: 'jul-2',
    name: 'Touxeachem Fest (Cucumber Festival)',
    month: 'July',
    monthIndex: 6,
    location: 'St. Anne Church, Talaulim',
    dateDisplay: '26 July · 8:30 AM',
    description: 'Unique feast where thousands offer fresh cucumbers to St. Anne seeking blessings for marriage and family.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1IcD5laydeB3cvZF1Q-kN9-6-xjUOz8RHp2mWUCUNZA&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'traditional',
    tags: ['Cucumber Offerings', 'St. Anne Church', '400-Yr Feast'],
    activityType: 'Parish Festival',
    audience: 'Couples & Families'
  },
  {
    id: 'jul-3',
    name: 'Vasco Bhajan Saptah & Regional Competitions',
    month: 'July',
    monthIndex: 6,
    location: 'Vasco da Gama & Ravindra Bhavans',
    dateDisplay: 'July · All Day',
    description: 'Non-stop devotional singing competitions for children, women, and classical groups across Konkan.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLZ452gPXAt3D7qdiQfPpPbRrRhRftADvu6tfwq5nogw&s=10',
    categoryBadge: 'Music & Classical',
    tags: ['Bhajan Competition', 'Vasco Saptah Prep', 'Devotional Vocal'],
    activityType: 'Bhajan Singing Contest',
    audience: 'Devotional Music Fans'
  },

  // --- AUGUST ---
  {
    id: 'aug-1',
    name: 'Bonderam Flag Festival',
    month: 'August',
    monthIndex: 7,
    location: 'Divar Island, Mandovi River',
    dateDisplay: '24 August · 3:00 PM',
    description: 'Colorful island festival reenacting ancient village land boundary disputes with mock bamboo weapons (Fotash) and brass band floats.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnVS8A0QHs_ph9MpSsOtsLNehNVaJm572rEn83U0zXmQ&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Divar Island', 'Fotash Bamboo Guns', 'Brass Float Parade'],
    activityType: 'Island Mock Parade',
    audience: 'Island Visitors & Locals'
  },
  {
    id: 'aug-2',
    name: 'Vasco Saptah (Damodar Temple Fair)',
    month: 'August',
    monthIndex: 7,
    location: 'Swatantra Path, Vasco da Gama',
    dateDisplay: 'Mid August · 8:00 AM',
    description: '7-day continuous temple festival and Goa’s longest street shopping fair with unbroken 24-hour bhajan singing.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSouf9cpLi-8vAo4EvhIFF-rMy-B_CghE6tG4a4t_eYA&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'featured',
    tags: ['7-Day Fair', '24-Hr Bhajan', 'Vasco Street Market'],
    activityType: '7-Day Street Fair',
    audience: 'Shoppers & Devotees'
  },
  {
    id: 'aug-3',
    name: 'Ganesh Chaturthi Preparations & Matoli Market',
    month: 'August',
    monthIndex: 7,
    location: 'Marcel, Banastarim & Mapusa Markets',
    dateDisplay: 'Late August · Morning',
    description: 'Vibrant markets filled with wild forest fruits, flowers, and wooden canopy frames for upcoming Chavath festivities.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQXULx7IIHxziULSSk9ItaRbJ-mL-byqJtO1392GE3_w&s=10',
    categoryBadge: 'Folk & Culture',
    tags: ['Matoli Flora Market', 'Wild Fruits', 'Chavath Prep'],
    activityType: 'Flora Bazaar',
    audience: 'Family Shoppers'
  },
  {
    id: 'aug-4',
    name: 'Novidade Harvest Feast & Gokulashtami',
    month: 'August',
    monthIndex: 7,
    location: 'Raia, Taleigao & Marcel Shrines',
    dateDisplay: 'August · Morning',
    description: 'Blessing of the season’s first paddy crop sheaves followed by midnight Dahi Handi pot-breaking celebrations.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnr4JX0tEB7zxDl1YLRkMglgs4ccBNPsHiajPtH7HyEA&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Harvest blessing', 'Paddy Sheaves', 'Dahi Handi'],
    activityType: 'Harvest Blessing',
    audience: 'Agricultural & Parish'
  },

  // --- SEPTEMBER ---
  {
    id: 'sep-1',
    name: 'Chavath / Ganesh Chaturthi & Matoli Canopy',
    month: 'September',
    monthIndex: 8,
    location: 'Marcel, Ponda, Priol & Across Goa',
    dateDisplay: 'September · All Day',
    description: 'Goa’s grandest family homecoming festival. Features intricate Matoli wooden ceiling canopies woven with 100+ wild forest fruits and clay idols.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdt2GNj0d1i0NSdvDdbBuZ69Gr97el5-yum1bl2URurw&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Matoli Canopy', 'Clay Idols', 'Family Homecoming'],
    activityType: 'Family & Village Festival',
    audience: 'Family-friendly'
  },
  {
    id: 'sep-2',
    name: 'Sangodutsav River Procession',
    month: 'September',
    monthIndex: 8,
    location: 'Cumbarjua & Marcel Rivers',
    dateDisplay: 'September · 4:00 PM',
    description: 'Water procession carrying Ganesha idols on decorated river barges accompanied by dhol drums and chanting before immersion.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZjYFnKp5N3-ye7LA9NBpv8-nTd_CzTgvu43HYjlaedg&s',
    categoryBadge: 'Temple Zatra',
    tags: ['River Barges', 'Ganesh Visarjan', 'Cumbarjua'],
    activityType: 'River Immersion Parade',
    audience: 'Spectators'
  },
  {
    id: 'sep-3',
    name: 'State Konkani Tiatr Drama Competition',
    month: 'September',
    monthIndex: 8,
    location: 'Ravindra Bhavan, Margao',
    dateDisplay: 'September · 6:30 PM',
    description: 'Celebration of Goa’s unique 130-year-old musical theatre artform blending socio-political satire, comedy, and live brass orchestras.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9v3Ny7Us3VJdCDiMdDI-vV4WrYQXcGcoPeAqnuEtfkQ&s=10',
    categoryBadge: 'Theatre & Art',
    badgeType: 'traditional',
    tags: ['Konkani Tiatr', 'Live Brass Orchestra', 'Margao Stage'],
    activityType: 'Konkani Musical Theatre',
    audience: 'Theatre Lovers'
  },
  {
    id: 'sep-4',
    name: 'Pt. Jitendra Abhisheki Smruti Sangeet Samaroh',
    month: 'September',
    monthIndex: 8,
    location: 'Kala Academy, Panaji',
    dateDisplay: 'September · 6:00 PM',
    description: 'Prestigious classical vocal and instrumental music festival honoring India’s legendary music maestro.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpn-hrScQvsupXvLjkyZ0BCYYB3EJTmw4nwSFL_GXfpg&s=10',
    categoryBadge: 'Music & Classical',
    tags: ['Classical Vocal', 'Santoor & Tabla', 'Kala Academy'],
    activityType: 'Classical Music Recital',
    audience: 'Music Connoisseurs'
  },

  // --- OCTOBER ---
  {
    id: 'oct-1',
    name: 'Navratri Garba Night',
    month: 'October',
    monthIndex: 9,
    location: 'Mapusa, North Goa',
    dateDisplay: '12 Oct · 7:30 PM',
    description: 'Traditional Navratri night with live folk musicians, colorful garba dancing, and authentic festive Goan sweet stalls.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiweMzYeTmPnrD1gmtUac3wwX7z8qx-OfUIYx7KPtdcA&s=10',
    categoryBadge: 'Cultural event',
    badgeType: 'bestMatch',
    tags: ['Traditional dance', 'Family-friendly', 'Garba Raas'],
    activityType: 'Traditional dance',
    audience: 'Family-friendly'
  },
  {
    id: 'oct-2',
    name: 'Goa Heritage Walk',
    month: 'October',
    monthIndex: 9,
    location: 'Fontainhas, Panjim',
    dateDisplay: '18 Oct · 9:00 AM',
    description: 'Guided architectural stroll through Latin Quarter, visiting ancient Portuguese mansions, azulejos tile studios, and bakeries.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUvJsYONXoaDz57vDr28NII1u8NgpZnnXuEUW4HzpBBg&s=10',
    categoryBadge: 'Heritage',
    badgeType: 'thisMonth',
    tags: ['Portuguese heritage', 'Guided', 'Latin Quarter'],
    activityType: 'Portuguese heritage',
    audience: 'Guided'
  },
  {
    id: 'oct-3',
    name: 'Local Folk Music Evening',
    month: 'October',
    monthIndex: 9,
    location: 'Assagao, North Goa',
    dateDisplay: '26 Oct · 6:30 PM',
    description: 'Acoustic evening featuring traditional Goan Mando songs, Ghumot drumming, and storytelling by local village artists.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCgLysiT2E2OmVRzwn3wNNiI_LtL6rdMq-8kKwmjvjFA&s=10',
    categoryBadge: 'Music',
    badgeType: 'thisMonth',
    tags: ['Live folk music', 'Local artists', 'Mando & Ghumot'],
    activityType: 'Live folk music',
    audience: 'Local artists'
  },
  {
    id: 'oct-4',
    name: 'Dussehra / Vijayadashami & Tarang Parade',
    month: 'October',
    monthIndex: 9,
    location: 'Sanquelim, Ponda & Panaji',
    dateDisplay: 'October · 6:00 PM',
    description: 'Victory of good over evil with tarang sacred palanquins, weapon blessing rituals, and evening cultural pageantry.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-FGo3h62fOZYS5eGggfyLe-gP7leA-8ULWSATFb8lFg&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'featured',
    tags: ['Tarang Palanquins', 'Sanquelim', 'Vijayadashami'],
    activityType: 'Sacred Palanquin',
    audience: 'All Ages'
  },
  {
    id: 'oct-5',
    name: 'Colva Fama de Menino Jesus',
    month: 'October',
    monthIndex: 9,
    location: 'Colva Church, South Goa',
    dateDisplay: 'October · 6:00 AM',
    description: 'Historic solemn feast where the revered miraculous statue of Menino Jesus (Infant Jesus) is brought down for public veneration.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrDJiEERSICO2Xc_LaZca-qQhEP7-mbbcmakk_6-6TCQ&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'traditional',
    tags: ['Infant Jesus Veneration', 'Colva Church', 'Beach Fair'],
    activityType: 'Religious Veneration',
    audience: 'Pilgrims & Tourists'
  },
  {
    id: 'oct-6',
    name: 'Naraka Chaturdashi & Giant Narkasur Burning',
    month: 'October',
    monthIndex: 9,
    location: 'Panaji, Margao & Mapusa Streets',
    dateDisplay: 'October (Diwali Eve) · 10:00 PM',
    description: 'Midnight burning of massive handcrafted paper-mâché Narkasur demon effigies across cities before Diwali dawn.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2gZQi5K677g2jTh_-_PQosUwZtWpwIETTgYddvVDn3Q&s=10',
    categoryBadge: 'Major Festival',
    tags: ['Giant Narkasur Effigies', 'Diwali Eve', 'Street Music'],
    activityType: 'Effigy Burning Parade',
    audience: 'Night Crowd & Youth'
  },
  {
    id: 'oct-7',
    name: 'Diwali & Deepotsav Illumination',
    month: 'October',
    monthIndex: 9,
    location: 'Across Homes & Shrines in Goa',
    dateDisplay: 'October / November · Evening',
    description: 'Festival of lights with clay diyas outside homes, traditional puffed rice (Fov) treats, and lit temple courtyards.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe-qM5VxZXcH3cs1EHLgd41-mzR99vVre-J_viaAvmyg&s=10',
    categoryBadge: 'Major Festival',
    tags: ['Diya Illumination', 'Fov Sweet Feasts', 'Deepavali'],
    activityType: 'Light Illumination',
    audience: 'Family-friendly'
  },

  // --- NOVEMBER ---
  {
    id: 'nov-1',
    name: 'Tripurari Poornima Boat Festival',
    month: 'November',
    monthIndex: 10,
    location: 'Valvanti Riverbank, Sanquelim',
    dateDisplay: 'November · 7:00 PM',
    description: 'Spectacular nocturnal river festival featuring handcrafted miniature floating boat models, burning lamps, and fireworks.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9yxnHC_FmKD4Vbr-v8N2HSsTD4qR6KIFn7QpdhcEOzA&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Miniature Floating Boats', 'Valvanti River', 'Fireworks'],
    activityType: 'Floating Boat Parade',
    audience: 'Spectators & Families'
  },
  {
    id: 'nov-2',
    name: 'Dindi Utsav & Bhajan Dindi',
    month: 'November',
    monthIndex: 10,
    location: 'Margao & Pirna',
    dateDisplay: 'November · 6:00 PM',
    description: 'Devotional singing processions carrying sacred palkhis through town streets with cymbals and mridangam drums.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNQEif8nEBvsJKyFUQK-N5SVJ5xBv8CQTpVVp7smXhZw&s=10',
    categoryBadge: 'Temple Zatra',
    tags: ['Palkhi Procession', 'Margao Town', 'Devotional Singing'],
    activityType: 'Chanting Procession',
    audience: 'Community'
  },
  {
    id: 'nov-3',
    name: 'Goa International Film Festival (IFFI)',
    month: 'November',
    monthIndex: 10,
    location: 'INOX & Mandovi Promenade, Panaji',
    dateDisplay: '20-28 November · All Day',
    description: 'Asia’s premier film festival featuring red carpet galas, international film premieres, masterclasses, and open-air riverside screenings.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq2MqH-lYa-2TV1lyVpKBMAE099AfG5yiKAgmIFDgewQ&s',
    categoryBadge: 'Theatre & Art',
    badgeType: 'featured',
    tags: ['Global Cinema', 'Red Carpet', 'Mandovi Screenings'],
    activityType: 'Film Screenings',
    audience: 'Cinephiles & Tourists'
  },
  {
    id: 'nov-4',
    name: 'Serendipity Arts Festival',
    month: 'November',
    monthIndex: 10,
    location: 'Mandovi Riverfront, Panaji',
    dateDisplay: 'Late November / December · 10:00 AM',
    description: 'Multi-disciplinary arts festival spanning visual art, craft, culinary arts, music, dance, and interactive theatre along Panaji.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtwwKkvD72p3vZuPCBbftD5Omm3uzqzKmuD0vJ6RQfgA&s=10',
    categoryBadge: 'Folk & Culture',
    badgeType: 'thisMonth',
    tags: ['Multi-Arts', 'Visual Exhibitions', 'Panaji Riverfront'],
    activityType: 'Multi-Arts Gala',
    audience: 'Art & Design Fans'
  },
  {
    id: 'nov-5',
    name: 'Feast of Our Lady of Rosary',
    month: 'November',
    monthIndex: 10,
    location: 'Navelim Church, South Goa',
    dateDisplay: 'November · 8:00 AM',
    description: 'Major South Goa parish feast with massive fair grounds, household feasts, and brass band music.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbUeMcsIQi17AsZKFkpcLa8DoySJMg5ZYm6c4bymen7w&s=10',
    categoryBadge: 'Parish Feast',
    tags: ['Navelim Feast', 'Brass Orchestra', 'Parish Market'],
    activityType: 'Parish Market & Mass',
    audience: 'Local Parishes'
  },

  // --- DECEMBER ---
  {
    id: 'dec-1',
    name: 'Feast of St. Francis Xavier (Goencho Saib)',
    month: 'December',
    monthIndex: 11,
    location: 'Basilica of Bom Jesus, Old Goa',
    dateDisplay: '03 December · 6:00 AM',
    description: 'Goa grandest spiritual pilgrimage honoring St. Francis Xavier. Draws hundreds of thousands for open-air High Mass and historical fair grounds.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkVCQ33YtFqqav6FFDZqMP5qKVt8RYBCO1Mz9PcdutDg&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'bestMatch',
    tags: ['Global Pilgrimage', 'Old Goa Basilica', 'High Mass'],
    activityType: 'Global Pilgrimage Mass',
    audience: 'Pilgrims & Tourists'
  },
  {
    id: 'dec-2',
    name: 'Feast of Our Lady of Immaculate Conception',
    month: 'December',
    monthIndex: 11,
    location: 'Church Square, Panaji',
    dateDisplay: '08 December · 8:00 AM',
    description: 'Iconic celebration at Panaji’s white zig-zag stair church, illuminated with fairy lights, brass band tunes, and sweet stalls.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS49p5QxwruEzzuMRe4mNCQDok7kLTcrSlffQQcPCRFJw&s=10',
    categoryBadge: 'Parish Feast',
    badgeType: 'featured',
    tags: ['Illuminated Church', 'Panaji Landmark', 'Brass Bands'],
    activityType: 'Illuminated Night Fair',
    audience: 'Family-friendly'
  },
  {
    id: 'dec-3',
    name: 'Goa Liberation Day Cultural Celebrations',
    month: 'December',
    monthIndex: 11,
    location: 'Campal Grounds, Panaji',
    dateDisplay: '19 December · 9:00 AM',
    description: 'State parade, freedom fighter honors, cultural float pageantry, and evening fireworks celebrating Goa’s liberation.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQblq8OpnqwyfwNrIkr5cDifbLtzJEy4bFoy3dWzjTJKA&s=10',
    categoryBadge: 'Civic Cultural',
    tags: ['Liberation Parade', 'State Float Pageant', 'Fireworks'],
    activityType: 'Civic Parade',
    audience: 'General Public'
  },
  {
    id: 'dec-4',
    name: 'Traditional Goan Christmas & Midnight Mass',
    month: 'December',
    monthIndex: 11,
    location: 'Panaji, Saligao, Fontainhas & Old Goa',
    dateDisplay: '24-25 December · 11:00 PM',
    description: 'Warm Goan Christmas tradition with midnight choir mass, illuminated star lanterns outside heritage homes, crib displays, and dodol & neuri sweets.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUXBXc6xnShns0-GTuTV_oDoWTqAOE0XaIqEB4OyehPQ&s=10',
    categoryBadge: 'Major Festival',
    badgeType: 'thisMonth',
    tags: ['Midnight Mass', 'Star Lanterns', 'Dodol & Bebinca'],
    activityType: 'Midnight Mass & Carols',
    audience: 'Family & Visitors'
  },
  {
    id: 'dec-5',
    name: 'Diwaza Festival of Sattari',
    month: 'December',
    monthIndex: 11,
    location: 'Kopardem, Sattari',
    dateDisplay: 'December · 6:00 PM',
    description: 'Traditional deepa oil lamp festival celebrated in the lush foothill villages of Sattari with folk songs.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3XVt3pmqW1WDZN4MDhUEv8O5UDiqOeWRg_s2sctZDAw&s=10',
    categoryBadge: 'Folk & Culture',
    tags: ['Deepa Lamps', 'Sattari Foothills', 'Folk Songs'],
    activityType: 'Oil Lamp Festival',
    audience: 'Local Community'
  },
  {
    id: 'dec-6',
    name: 'Seafood Festival & Raponkaranche Fest',
    month: 'December',
    monthIndex: 11,
    location: 'Baga & Arambol Beach',
    dateDisplay: 'December · 5:00 PM',
    description: 'Beachside culinary festival celebrating traditional Goan fish curry recipes, crab xacuti, and live acoustic music.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-O2L6Uy0K-UxOuyjCv1rWxFQytPu_sNa9VFC9NsJkg&s=10',
    categoryBadge: 'Food & Crafts',
    tags: ['Beach Seafood', 'Crab Xacuti', 'Acoustic Bands'],
    activityType: 'Beach Culinary Gala',
    audience: 'Foodies & Travelers'
  },
];

export const CulturePage: React.FC<CulturePageProps> = ({
  preferences,
  onBack,
  onAskGAI,
  savedPlaces = [],
  onToggleSavePlace,
}) => {
  // Active Tab: 'events' | 'traditions'
  const [activeTab, setActiveTab] = useState<'events' | 'traditions'>('events');

  // Month Index Filter: default to October or user preferences month
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(() => {
    const userM = (preferences.travelMonth || 'October').toLowerCase();
    const idx = ALL_MONTHS.findIndex((m) => m.name.toLowerCase() === userM);
    return idx >= 0 ? idx : 9; // Default October (9) if not matched
  });

  // Month Picker Modal Sheet State
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSavePlace) {
      const evt = CULTURAL_EVENTS.find((item) => item.id === id);
      if (evt) {
        onToggleSavePlace({
          id: evt.id,
          title: evt.name,
          category: 'culture',
          subtitle: evt.categoryBadge,
          location: evt.location,
          image: evt.image,
          ratingOrPrice: evt.dateDisplay,
        });
      }
    }
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const currentMonthData = ALL_MONTHS[selectedMonthIndex];
  const currentTip = MONTHLY_CULTURAL_TIPS[selectedMonthIndex] || MONTHLY_CULTURAL_TIPS[9];

  // Filter Events strictly by selected month
  const filteredEvents = CULTURAL_EVENTS.filter((evt) => evt.monthIndex === selectedMonthIndex);

  // Tab Slide Motion Variants
  const tabVariants = {
    initial: (tab: 'events' | 'traditions') => ({
      x: tab === 'events' ? -20 : 20,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] as const },
    },
    exit: (tab: 'events' | 'traditions') => ({
      x: tab === 'events' ? 20 : -20,
      opacity: 0,
      transition: { duration: 0.15, ease: [0.25, 1, 0.5, 1] as const },
    }),
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-[#F7F7F5] flex flex-col justify-between max-w-[430px] mx-auto select-none relative overflow-hidden w-full font-sans">
      {/* 1. PINNED STICKY TOP HEADER (No Profile Icon) */}
      <header className="shrink-0 z-30 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-gray-200/70 px-4 pt-3 pb-2.5 flex flex-col gap-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between relative">
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer z-10"
            aria-label="Back to Homepage"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.5 15L7.5 10L12.5 5" />
            </svg>
          </button>

          {/* Centered Title */}
          <h1 className="text-[20px] font-black text-[#111111] tracking-tight absolute inset-0 flex items-center justify-center pointer-events-none">
            Culture
          </h1>

          {/* Spacer for symmetrical centering */}
          <div className="w-9 h-9 opacity-0 pointer-events-none" />
        </div>

        {/* 2. TOP SEGMENTED CONTROL TABS (Events vs Traditions & Arts) */}
        <div className="bg-[#EAEAE8] p-1 rounded-full flex items-center shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2.5 rounded-full text-[14px] font-bold transition-all text-center cursor-pointer ${
              activeTab === 'events'
                ? 'bg-[#177F91] text-white shadow-[0_2px_8px_rgba(23,127,145,0.35)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Events
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('traditions')}
            className={`flex-1 py-2.5 rounded-full text-[14px] font-bold transition-all text-center cursor-pointer ${
              activeTab === 'traditions'
                ? 'bg-[#177F91] text-white shadow-[0_2px_8px_rgba(23,127,145,0.35)]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Traditions & Arts
          </button>
        </div>
      </header>

      {/* 3. SCROLLABLE BODY CONTAINER WITH TAB TRANSITIONS */}
      <div
        className="flex-1 overflow-y-auto px-4 pt-3 pb-12 space-y-3.5 min-h-0 overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <AnimatePresence mode="wait" custom={activeTab}>
          {activeTab === 'events' ? (
            <motion.div
              key="events-tab"
              custom={activeTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-3.5"
            >
              {/* HERO BANNER CARD */}
              <div className="relative rounded-[24px] overflow-hidden shadow-md min-h-[185px] flex items-end p-5 bg-black">
                <img
                  src={goaCulturalImg}
                  alt="Goa Cultural Procession"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                <div className="relative z-10 text-white w-full">
                  <h2 className="text-[22px] font-black tracking-tight leading-tight drop-shadow-md">
                    Experience Goa beyond the beaches.
                  </h2>
                  <p className="text-[13px] font-medium text-white/90 mt-1 drop-shadow-xs">
                    Festivals, traditions, music & local life.
                  </p>
                </div>
              </div>

              {/* CLEAR PROMINENT MONTH FILTER BAR */}
              <div className="bg-white rounded-2xl border border-gray-200/90 p-3 shadow-xs space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                    <svg className="w-3.5 h-3.5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <span>Filter by Month</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMonthPickerOpen(true)}
                    className="text-[11px] font-extrabold text-[#177F91] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>All 12 Months</span>
                    <span>▾</span>
                  </button>
                </div>

                {/* Main Filter Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsMonthPickerOpen(true)}
                  className="w-full rounded-xl bg-[#E0F2FE] border border-[#0284C7]/40 px-3.5 py-2.5 flex items-center justify-between text-[#0369A1] shadow-2xs hover:bg-[#D0EBFD] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 font-black text-[14px]">
                    <svg className="w-4 h-4 text-[#0284C7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>{currentMonthData.name}</span>
                    <span className="text-xs font-bold text-[#0284C7] bg-white/80 px-2 py-0.5 rounded-full border border-[#0284C7]/30">
                      {filteredEvents.length} events
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black">
                    <span>Change Month</span>
                    <span className="text-sm">▾</span>
                  </div>
                </button>

                {/* Quick Month Chips Row for Instant Filter Switch */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
                  {ALL_MONTHS.map((m, idx) => {
                    const isSelected = selectedMonthIndex === idx;
                    return (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setSelectedMonthIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#177F91] text-white shadow-2xs scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {m.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CULTURAL INSIDER TIP */}
              <div className="bg-[#F0FDF4] border border-[#B9F6CA] rounded-2xl p-3.5 shadow-2xs flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
                <p className="text-[12.5px] font-semibold text-[#1B5E20] leading-relaxed">
                  {currentTip}
                </p>
              </div>

              {/* CULTURAL EVENTS LIST */}
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18a1 1 0 0 1-2 0v-1.07A6 6 0 0 1 6.07 12H5a1 1 0 0 1 0-2h1.07A6 6 0 0 1 11 4.93V4a1 1 0 0 1 2 0v.93A6 6 0 0 1 17.93 10H19a1 1 0 0 1 0 2h-1.07A6 6 0 0 1 13 16.93z" />
                    </svg>
                    <span>{currentMonthData.name} Cultural Events ({filteredEvents.length})</span>
                  </h3>
                </div>

                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => {
                    const isFav = favorites.includes(evt.id) || savedPlaces.some((p) => p.id === evt.id);

                    return (
                      <div
                        key={evt.id}
                        onClick={() =>
                          onAskGAI(
                            `Tell me full details, timing, exact location, and insider tips for attending ${evt.name} in ${evt.location} during ${evt.month}.`
                          )
                        }
                        className="bg-white rounded-[24px] border border-gray-200/80 shadow-xs overflow-hidden hover:shadow-md active:scale-[0.99] transition-all flex flex-col cursor-pointer"
                      >
                        {/* Image Header with Heart & Category Badge */}
                        <div className="relative h-48 w-full bg-gray-100">
                          <img
                            src={evt.image}
                            alt={evt.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {evt.badgeType === 'bestMatch' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#38BDF8] text-[#0369A1] font-extrabold text-[11px] shadow-xs">
                                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                  <span>Best match</span>
                                </span>
                              )}
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FFE4E6] text-[#E11D48] font-extrabold text-[11px] shadow-xs">
                                {evt.categoryBadge}
                              </span>
                            </div>

                            {/* Heart Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(evt.id, e)}
                              className={`w-8.5 h-8.5 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                                isFav
                                  ? 'bg-red-500 text-white shadow-xs'
                                  : 'bg-black/30 text-white hover:bg-black/50'
                              }`}
                              aria-label="Favorite"
                            >
                              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Card Body Details */}
                        <div className="p-4 space-y-2">
                          <h3 className="text-[18px] font-black text-gray-900 leading-tight">
                            {evt.name}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700">
                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{evt.location}</span>
                          </div>

                          {/* Date & Time */}
                          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#177F91]">
                            <svg className="w-3.5 h-3.5 text-[#177F91] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                              <line x1="16" x2="16" y1="2" y2="6" />
                              <line x1="8" x2="8" y1="2" y2="6" />
                              <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            <span>{evt.dateDisplay}</span>
                          </div>

                          {/* Description */}
                          <p className="text-[12.5px] text-gray-600 leading-relaxed pt-0.5">
                            {evt.description}
                          </p>

                          {/* Bottom Tag Specs */}
                          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-gray-600 text-[12px] font-semibold">
                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                              {evt.activityType && (
                                <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                  </svg>
                                  <span>{evt.activityType}</span>
                                </span>
                              )}
                              {evt.audience && (
                                <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                  </svg>
                                  <span>{evt.audience}</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[#177F91] font-extrabold text-xs shrink-0 pl-2">
                              Ask GAI ›
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white rounded-3xl border border-gray-200/80 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V18a1 1 0 0 1-2 0v-1.07A6 6 0 0 1 6.07 12H5a1 1 0 0 1 0-2h1.07A6 6 0 0 1 11 4.93V4a1 1 0 0 1 2 0v.93A6 6 0 0 1 17.93 10H19a1 1 0 0 1 0 2h-1.07A6 6 0 0 1 13 16.93z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      No events listed for {currentMonthData.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Tap below to choose another month.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsMonthPickerOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#177F91] text-white font-bold text-xs cursor-pointer"
                    >
                      Select Month
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* TRADITIONS & ARTS TAB CONTENT WITH MOTION TRANSITION */
            <motion.div
              key="traditions-tab"
              custom={activeTab}
              variants={tabVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-[#177F91] tracking-wider">Heritage & Living Culture</span>
                <h3 className="text-lg font-black text-gray-900">Goan Folk Music & Musical Instruments</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Goan music blends Western acoustic guitars and brass with traditional Konkan percussion. The iconic <strong>Ghumot</strong> (earthenware percussion pot) is recognized as a State Heritage Instrument.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="text-sm font-bold text-gray-900">Mando & Fado</div>
                    <div className="text-[11px] text-gray-500">Romantic ballads & Latin soul</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="text-sm font-bold text-gray-900">Romtamel Drums</div>
                    <div className="text-[11px] text-gray-500">High-energy Shigmo beat</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-[#177F91] tracking-wider">Traditional Folk Dances</span>
                <h3 className="text-lg font-black text-gray-900">Fugdi, Dekhnni & Corridinho</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Goa’s folk dances celebrate village harvests, community solidarity, and mythological sagas.
                </p>
                <ul className="text-xs text-gray-700 space-y-1.5 list-disc pl-4 font-medium">
                  <li><strong>Fugdi & Dhalo:</strong> Traditional women’s circle dance performed during Gauri and Chavath.</li>
                  <li><strong>Ghodemodni:</strong> Martial dance recreating the horse-riding Maratha warriors of Bicholim.</li>
                  <li><strong>Dekhnni:</strong> Graceful dance set to Konkani folk melodies depicting river boatmen.</li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs space-y-3">
                <span className="text-xs font-black uppercase text-[#177F91] tracking-wider">Arts & Crafts</span>
                <h3 className="text-lg font-black text-gray-900">Azulejos Tiles & Kaavi Art</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hand-painted glazed ceramic tiles (Azulejos) decorate Fontainhas, while ancient red-oxide sgraffito wall art (Kaavi) graces ancient Ponda temples.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MONTH PICKER MODAL SHEET */}
      <AnimatePresence>
        {isMonthPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 select-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMonthPickerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Bottom Sheet Grid */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="w-full max-w-[430px] bg-white rounded-t-[32px] sm:rounded-3xl p-5 shadow-2xl relative z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />

              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Filter Events by Month</h3>
                  <p className="text-xs text-gray-500">Select any month to filter cultural festivals</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMonthPickerOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                  aria-label="Close month picker"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* 12 Months Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {ALL_MONTHS.map((m, idx) => {
                  const isSelected = selectedMonthIndex === idx;
                  const monthEventsCount = CULTURAL_EVENTS.filter((evt) => evt.monthIndex === idx).length;

                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSelectedMonthIndex(idx);
                        setIsMonthPickerOpen(false);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#177F91] border-[#177F91] text-white shadow-xs'
                          : 'bg-gray-50 border-gray-100 text-gray-800 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-sm font-extrabold flex items-center justify-between">
                        <span>{m.name}</span>
                        {isSelected ? (
                          <span className="text-white text-xs font-bold inline-flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Selected</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[10px] font-semibold">{monthEventsCount} events</span>
                        )}
                      </div>
                      <div className={`text-[10.5px] font-medium truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {m.tag}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
