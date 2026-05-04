import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeaderESN from "../components/HeaderESN";
import FooterESN from "../components/FooterESN";
import { useCart } from "../context/CartContext";

const COMBO_HERO =
  "https://i.ibb.co/Jj2M4bPT/Gemini-Generated-Image-1vfwwz1vfwwz1vfw.png";

const COMBO_ITEMS = [
  {
    key: "designer_whey",
    name: "Designer Whey 908g",
    subtitle: "908g",
    slug: "esn-designer-whey-protein",
    image: "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_MilkChocolateFlavor_2024x2024_shop-rHcG0v3w_609c8915-2161-4548-9969-93857677536b_grande.jpg?v=1744207024",
    flavors: [
      "Chocolate Fudge", "Vanilla Milk", "Strawberry Cream", "Banana",
      "Cookies & Cream", "Cinnamon Roll", "Hazelnut Nougat", "Almond Coconut",
      "Caramel", "Neutral",
    ],
    flavorImages: {
      "Chocolate Fudge": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_MilkChocolateFlavor_2024x2024_shop-rHcG0v3w_609c8915-2161-4548-9969-93857677536b_grande.jpg?v=1744207024",
      "Vanilla Milk": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_VanillaMilkFlavor_2024x2024_shop-6m4UKnvQ_d7f770e0-8cc4-464a-92cf-45c0ec1b4c8f_grande.jpg?v=1770125111",
      "Strawberry Cream": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_StrawberryCreamFlavor_2024x2024_shop-ACyKV-vb_8ba46feb-21f8-4752-89ec-09c7a5e8fce6_grande.jpg?v=1744207029",
      "Banana": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_BananaMilkFlavor_2024x2024_shop-JWA6s_XC_61ae5c68-a385-4524-aba7-fba0aa0a64bc_grande.jpg?v=1744207024",
      "Cookies & Cream": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_DarkCookies_CreamFlavor_2024x2024_shop-Hz8p4pvq_f50ebbb0-b4a5-48a5-8cd0-c65fe58b5503_grande.jpg?v=1744207026",
      "Cinnamon Roll": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_CinnamonCerealFlavor_2024x2024_shop-rDT1jzi2_76e58790-825e-4162-8a90-dab97fe6732d_grande.jpg?v=1744207029",
      "Hazelnut Nougat": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_MilkyHazelnutFlavor_2024x2024_shop-_CrSra0j_a43383b2-de83-4a2c-9c79-bcc60dd5a182_grande.jpg?v=1744207025",
      "Almond Coconut": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_AlmondCoconutFlavor_2024x2024_shop-iCbreuNy_c640bbf7-d33b-4e04-9670-3ab420c5176d_grande.jpg?v=1744207018",
      "Caramel": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_StroopwafelFlavor_2024x2024_shop-6SKtnm6Q_2058ab2f-6a1d-4e75-9294-503618c39aa9_grande.jpg?v=1760971147",
      "Neutral": "https://www.esn.com/cdn/shop/files/DesignerWhey_908g_NeutralFlavor_2024x2024_shop-fObg7Bqh_61341654-6b3c-4e34-89b4-e3647a506a6a_grande.jpg?v=1744207027",
    },
  },
  {
    key: "isoclear",
    name: "Isoclear 908g",
    subtitle: "908g",
    slug: "esn-isoclear-whey-isolate",
    image: "https://i.ibb.co/XxwLcvQd/Iso-Clear-908g-Pina-Colada-Flavor-2024x2024-shop-a-bo-LTst-16635687-1341-4753-8426-6c37ab19f2c1.webp",
    flavors: [
      "Green Apple", "Peach Iced Tea", "Lemon Iced Tea", "Tropical Punch",
      "Royal Candy", "Cherry Lemonade", "Strawberry Lime",
    ],
    flavorImages: {
      "Green Apple": "https://www.esn.com/cdn/shop/files/IsoClear_908g_GreenAppleFlavor_2024x2024_shop-PTedBm7D_9eafa0fc-ddc0-4a9a-9082-c5a24c2cd810_grande.jpg?v=1750793074",
      "Peach Iced Tea": "https://www.esn.com/cdn/shop/files/IsoClear_908g_PeachIcedTeaFlavor_2024x2024_shop-YaY8xvyE_d0bdad97-4b4a-48e2-b6cd-74880a53648c_grande.jpg?v=1750793075",
      "Lemon Iced Tea": "https://www.esn.com/cdn/shop/files/IsoClear_908g_LemonIcedTeaFlavor_2024x2024_shop-oesb3JOI_12638e5f-8923-47ca-99e3-8dcdb1be0e47_grande.jpg?v=1750793074",
      "Tropical Punch": "https://www.esn.com/cdn/shop/files/IsoClear_908g_TropicalPunchFlavor_2024x2024_shop-h_ENX4yh_58822942-a31d-46a1-aa8d-34151c02182d_grande.jpg?v=1769161832",
      "Royal Candy": "https://www.esn.com/cdn/shop/files/IsoClear_908g_RoyalCandyFlavor_2024x2024_shop-bPcaSXnC_b832db6a-040c-4214-8957-cec62c0f6245_grande.jpg?v=1775741941",
      "Cherry Lemonade": "https://www.esn.com/cdn/shop/files/IsoClear_908g_CherryLemonadeFlavor_2024x2024_shop-_7uaw3Tc_4902cd58-f92f-4bdc-b030-6b903b3d3465_grande.jpg?v=1750793072",
      "Strawberry Lime": "https://www.esn.com/cdn/shop/files/IsoClear_908g_StrawberryLimeFlavor_2024x2024_shop-CNT7rmQH_4371189c-ef25-4061-801e-d5f87defeec9_grande.jpg?v=1750793076",
    },
  },
  {
    key: "crank",
    name: "Crank 380g",
    subtitle: "380g",
    slug: "esn-crank",
    image: "https://www.esn.com/cdn/shop/files/Crank_380g_BlackberryFlavor_2024x2024_shop-Ky6j3hay_e04a4802-9642-4856-ad9b-69379cd8f308_grande.jpg?width=800",
    flavors: [
      "Mango Maui", "Sour Apple", "Cola", "Blue Raspberry",
      "Tropical", "Blackberry", "Lemon Lime",
    ],
    flavorImages: {
      "Mango Maui": "https://www.esn.com/cdn/shop/files/Crank_380g_TropicalPunchFlavor_2024x2024_shop-ZU6htQAB_e3bdf344-0570-4539-92f4-26423f9da1ae_grande.jpg?width=800",
      "Sour Apple": "https://www.esn.com/cdn/shop/files/Crank_380g_SourPowerFlavor_2024x2024_shop-Qh3Xo9i0_df3d2f9b-1e08-4d98-a43f-7f0a1db332f7_grande.jpg?width=800",
      "Cola": "https://www.esn.com/cdn/shop/files/Crank_380g_ColaFlavor_2024x2024_shop-ndz-vYDZ_c8f21012-f0d7-4a90-911b-4eccda846822_grande.jpg?width=800",
      "Blue Raspberry": "https://www.esn.com/cdn/shop/files/Crank_380g_BlackberryFlavor_2024x2024_shop-Ky6j3hay_e04a4802-9642-4856-ad9b-69379cd8f308_grande.jpg?width=800",
      "Tropical": "https://www.esn.com/cdn/shop/files/Crank_380g_TropicalPunchFlavor_2024x2024_shop-ZU6htQAB_e3bdf344-0570-4539-92f4-26423f9da1ae_grande.jpg?width=800",
      "Blackberry": "https://www.esn.com/cdn/shop/files/Crank_380g_BlackberryFlavor_2024x2024_shop-Ky6j3hay_e04a4802-9642-4856-ad9b-69379cd8f308_grande.jpg?width=800",
      "Lemon Lime": "https://www.esn.com/cdn/shop/files/Crank_380g_ColaFlavor_2024x2024_shop-ndz-vYDZ_c8f21012-f0d7-4a90-911b-4eccda846822_grande.jpg?width=800",
    },
  },
  {
    key: "designer_bar",
    name: "Designer Protein Bar 12 Einheiten",
    subtitle: "12x45g Box",
    slug: "designer-bar",
    image: "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_DarkChocolateSaltedAlmondFlavor_2024x2024_shop-4mvbqa9t_ff7823ec-c07e-4039-80a7-f3bf95d0638a_grande.jpg?v=1773753890",
    flavors: [
      "Hazelnut Nougat", "White Chocolate Pistachio", "Strawberry Yogurt", "Dark Cookie White Choc",
      "Cinnamon Cereal", "Dark Chocolate Salted Almond", "Fudge Brownie", "Almond Coconut",
      "Peanut Caramel",
    ],
    flavorImages: {
      "Hazelnut Nougat": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_HazelnutNougatFlavor_2024x2024_shop-ET2nendt_5f890e73-0059-418d-89d1-a13f30acc5cb_grande.jpg?v=1773753890",
      "White Chocolate Pistachio": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_WhiteChocolatePistachioFlavor_2024x2024_shop-zVk2d4vy_8620a7dd-2c80-4c28-b139-43621561eb6e_grande.jpg?v=1773666563",
      "Strawberry Yogurt": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_StrawberryYogurtFlavor_2024x2024_shop-2O331kPD_f4de1673-b0fe-4be6-8b6e-e7820f3d04fb_grande.jpg?v=1774018443",
      "Dark Cookie White Choc": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_DarkCookieWhiteChocFlavor_2024x2024_shop-BIZkYGGC_5ff82805-9cc1-436a-a5da-dc4d21a26286_grande.jpg?v=1773753890",
      "Cinnamon Cereal": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_CinnamonCerealFlavor_2024x2024_shop-nSvCXZu_932d9be0-b929-477a-abae-5b11fe4db8f6_grande.jpg?v=1773753890",
      "Dark Chocolate Salted Almond": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_DarkChocolateSaltedAlmondFlavor_2024x2024_shop-4mvbqa9t_ff7823ec-c07e-4039-80a7-f3bf95d0638a_grande.jpg?v=1773753890",
      "Fudge Brownie": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_FudgeBrownieFlavor_2024x2024_shop-J7HtK_vk_9b11199f-c7c3-4427-8d09-a54706b38c73_grande.jpg?v=1773753890",
      "Almond Coconut": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_AlmondCoconutFlavor_2024x2024_shop-vR2hiYO1_8ba69622-ec3b-4b5e-a91c-38ac88f42cea_grande.jpg?v=1773753890",
      "Peanut Caramel": "https://www.esn.com/cdn/shop/files/DesignerBar_45g_Tray_PeanutCaramelFlavor_2024x2024_shop-T23IBZeb_f41fa2c6-62e8-47cc-b56e-937c982e4195_grande.jpg?v=1774280361",
    },
  },
  {
    key: "daily",
    name: "Daily 480g",
    subtitle: "30 Sachets",
    slug: "esn-daily",
    image: "https://www.esn.com/cdn/shop/files/Daily_480g_CactusFruitFlavor_2024x2024_shop-ZTJBj2Ln_f6c0fd1b-c9af-43b4-9ff0-00a180714e8b_grande.jpg?width=800",
    flavors: ["Lemon", "Orange", "Mixed"],
    flavorImages: {
      "Lemon": "https://www.esn.com/cdn/shop/files/Daily_480g_CactusFruitFlavor_2024x2024_shop-ZTJBj2Ln_f6c0fd1b-c9af-43b4-9ff0-00a180714e8b_grande.jpg?width=800",
      "Orange": "https://www.esn.com/cdn/shop/files/Daily_480g_SourPowerFlavor_2024x2024_shop-0opuo55Y_0b69a8d3-33c2-48bf-bb54-ebd83231c412_grande.jpg?width=800",
      "Mixed": "https://www.esn.com/cdn/shop/files/Daily_480g_GreenAppleFlavor_2024x2024_shop-kp6ACJIR_a42c6590-af99-454d-bfba-1996eded22ef_grande.jpg?width=800",
    },
  },
  {
    key: "creatine",
    name: "Ultrapure Kreatin Pulver 500g",
    subtitle: "500g",
    slug: "esn-ultrapure-creatine-monohydrate",
    image: "https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_NeutralFlavor_2024x2024_shop-6v02cWzQ_a41b1095-1dad-4771-9e1b-4d233d8f358b_grande.jpg?width=800",
    flavors: ["Neutral", "Fresh Cherry", "Green Apple", "Lemon"],
    flavorImages: {
      "Neutral": "https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_NeutralFlavor_2024x2024_shop-6v02cWzQ_a41b1095-1dad-4771-9e1b-4d233d8f358b_grande.jpg?width=800",
      "Fresh Cherry": "https://www.esn.com/cdn/shop/files/UltrapureCreatine_250g_FreshCherryFlavor_2024x2024_shop-u7_Pb9i1_97ca7821-3baa-4706-ac4e-6b6fa1f803ae_grande.jpg?width=800",
      "Green Apple": "https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_NeutralFlavor_2024x2024_shop-6v02cWzQ_a41b1095-1dad-4771-9e1b-4d233d8f358b_grande.jpg?width=800",
      "Lemon": "https://www.esn.com/cdn/shop/files/UltrapureCreatine_500g_Beutel_NeutralFlavor_2024x2024_shop-6v02cWzQ_a41b1095-1dad-4771-9e1b-4d233d8f358b_grande.jpg?width=800",
    },
  },
  {
    key: "ashwa",
    name: "Ashwa+ Kapseln 120 Kaps.",
    subtitle: "120 Kaps.",
    slug: "esn-ashwa-pro",
    image: "https://www.esn.com/cdn/shop/files/Ashwa__120Caps_2024x2024_shop-ZiGfqmvZ_617765a7-6ae0-4a08-8e92-cc92773b2760_grande.jpg?width=800",
    flavors: ["Standard"],
    flavorImages: {
      "Standard": "https://www.esn.com/cdn/shop/files/Ashwa__120Caps_2024x2024_shop-ZiGfqmvZ_617765a7-6ae0-4a08-8e92-cc92773b2760_grande.jpg?width=800",
    },
  },
  {
    key: "magnesium",
    name: "Magnesium Complex 90 Kaps.",
    subtitle: "90 Kaps.",
    slug: "magnesium-complex",
    image: "https://www.esn.com/cdn/shop/files/MagnesiumComplex_90VeganCaps_2024x2024_shop-Nyzniicd_ab59e585-d0b9-45e7-92f6-a9ee5b94598a_grande.jpg?width=800",
    flavors: ["Standard"],
    flavorImages: {
      "Standard": "https://www.esn.com/cdn/shop/files/MagnesiumComplex_90VeganCaps_2024x2024_shop-Nyzniicd_ab59e585-d0b9-45e7-92f6-a9ee5b94598a_grande.jpg?width=800",
    },
  },
];

/* ── Nutrition data per product ── */
interface NutritionRow { label: string; per100g: string; perPortion: string }
interface NutritionIngredient { label: string; amount: string }
interface NutritionEntry {
  productKey: string;
  product: string;
  portionInfo: string;
  rows: NutritionRow[];
  activeIngredients?: NutritionIngredient[];
}

const NUTRITION_DATA: NutritionEntry[] = [
  {
    productKey: "designer_whey",
    product: "Designer Whey 908g",
    portionInfo: "30 g Pulver (ca. 1 Messlöffel) · 30 Portionen",
    rows: [
      { label: "Brennwert", per100g: "1556 kJ / 372 kcal", perPortion: "469 kJ / 112 kcal" },
      { label: "Fett", per100g: "3,7 g", perPortion: "1,1 g" },
      { label: "davon gesättigte Fettsäuren", per100g: "1,7 g", perPortion: "0,5 g" },
      { label: "Kohlenhydrate", per100g: "6,7 g", perPortion: "2,0 g" },
      { label: "davon Zucker", per100g: "4,1 g", perPortion: "1,2 g" },
      { label: "Eiweiß", per100g: "78 g", perPortion: "23,4 g" },
      { label: "Salz", per100g: "1,4 g", perPortion: "0,41 g" },
    ],
  },
  {
    productKey: "isoclear",
    product: "Isoclear 908g",
    portionInfo: "30 g Pulver + 500 ml Wasser · 30 Portionen",
    rows: [
      { label: "Brennwert", per100g: "1423 kJ / 340 kcal", perPortion: "427 kJ / 102 kcal" },
      { label: "Fett", per100g: "0 g", perPortion: "0 g" },
      { label: "davon gesättigte Fettsäuren", per100g: "0 g", perPortion: "0 g" },
      { label: "Kohlenhydrate", per100g: "1 g", perPortion: "0,3 g" },
      { label: "davon Zucker", per100g: "0 g", perPortion: "0 g" },
      { label: "Eiweiß", per100g: "84 g", perPortion: "25,2 g" },
      { label: "Salz", per100g: "0,28 g", perPortion: "0,08 g" },
    ],
  },
  {
    productKey: "crank",
    product: "Crank 380g",
    portionInfo: "19 g Pulver (1 Messlöffel) + 500 ml Wasser · 20 Portionen",
    rows: [
      { label: "Brennwert", per100g: "0 kJ / 0 kcal", perPortion: "0 kJ / 0 kcal" },
      { label: "Fett", per100g: "0 g", perPortion: "0 g" },
      { label: "Kohlenhydrate", per100g: "0 g", perPortion: "0 g" },
      { label: "davon Zucker", per100g: "0 g", perPortion: "0 g" },
      { label: "Eiweiß", per100g: "0 g", perPortion: "0 g" },
      { label: "Salz", per100g: "0 g", perPortion: "0 g" },
    ],
    activeIngredients: [
      { label: "L-Citrullin Malat", amount: "6.000 mg" },
      { label: "L-Arginin Alpha-Ketoglutarat", amount: "4.000 mg" },
      { label: "Koffein", amount: "200 mg" },
      { label: "Taurin", amount: "1.000 mg" },
      { label: "L-Tyrosin", amount: "1.000 mg" },
      { label: "L-Glycin", amount: "1.000 mg" },
      { label: "Grüntee-Extrakt", amount: "250 mg" },
      { label: "Traubenkernextrakt", amount: "250 mg" },
      { label: "Glucuronolacton", amount: "500 mg" },
      { label: "Schizandra-Extrakt", amount: "200 mg" },
      { label: "Ginsengwurzel-Extrakt", amount: "100 mg" },
      { label: "Rhodiola Rosea Extrakt", amount: "100 mg" },
      { label: "Bitterorangen-Extrakt (davon Synephrin 6 mg)", amount: "100 mg" },
      { label: "Pfeffer-Extrakt (davon Piperin 4 mg)", amount: "4,07 mg" },
    ],
  },
  {
    productKey: "designer_bar",
    product: "Designer Protein Bar 12 Einheiten",
    portionInfo: "1 Riegel (45 g) · 12 Riegel",
    rows: [
      { label: "Brennwert", per100g: "1631 kJ / 390 kcal", perPortion: "732 kJ / 175 kcal" },
      { label: "Fett", per100g: "19 g", perPortion: "8,6 g" },
      { label: "davon gesättigte Fettsäuren", per100g: "8,5 g", perPortion: "3,8 g" },
      { label: "Kohlenhydrate", per100g: "29,7 g", perPortion: "13,4 g" },
      { label: "davon Zucker", per100g: "3,1 g", perPortion: "1,5 g" },
      { label: "Ballaststoffe", per100g: "2,5 g", perPortion: "1,1 g" },
      { label: "Eiweiß", per100g: "31,5 g", perPortion: "14,2 g" },
      { label: "Salz", per100g: "0,25 g", perPortion: "0,1 g" },
    ],
  },
  {
    productKey: "daily",
    product: "Daily 480g",
    portionInfo: "24 g Pulver (1 Sachet) + 500 ml Wasser · 20 Portionen",
    rows: [],
    activeIngredients: [
      { label: "Kollagenhydrolysat", amount: "10 g" },
      { label: "davon TENDOFORTE®", amount: "5,0 g" },
      { label: "davon FORTIGEL®", amount: "5,0 g" },
      { label: "L-Glutamin", amount: "5,0 g" },
      { label: "Creatin Monohydrat", amount: "3,0 g" },
      { label: "L-Leucin", amount: "1,8 g" },
    ],
  },
  {
    productKey: "creatine",
    product: "Ultrapure Kreatin Pulver 500g",
    portionInfo: "3,5 g Pulver + 100 ml Wasser · 142 Portionen",
    rows: [
      { label: "Brennwert", per100g: "0 kJ / 0 kcal", perPortion: "0 kJ / 0 kcal" },
      { label: "Fett", per100g: "0 g", perPortion: "0 g" },
      { label: "Kohlenhydrate", per100g: "0 g", perPortion: "0 g" },
      { label: "davon Zucker", per100g: "0 g", perPortion: "0 g" },
      { label: "Eiweiß", per100g: "0 g", perPortion: "0 g" },
      { label: "Salz", per100g: "0 g", perPortion: "0 g" },
    ],
    activeIngredients: [
      { label: "Creatin Monohydrat", amount: "3,5 g" },
      { label: "davon Creatin", amount: "3,0 g" },
    ],
  },
  {
    productKey: "ashwa",
    product: "Ashwa+ Kapseln 120 Kaps.",
    portionInfo: "2 Kapseln · 60 Portionen",
    rows: [],
    activeIngredients: [
      { label: "Ashwagandha-Wurzelextrakt (KSM-66®)", amount: "600 mg" },
      { label: "davon Withanolide", amount: "30 mg" },
      { label: "Magnesium", amount: "60 mg" },
      { label: "Zink", amount: "2,0 mg" },
      { label: "Vitamin B6", amount: "0,2 mg" },
    ],
  },
  {
    productKey: "magnesium",
    product: "Magnesium Complex 90 Kaps.",
    portionInfo: "3 Kapseln · 30 Portionen",
    rows: [],
    activeIngredients: [
      { label: "Magnesium (elementar)", amount: "323 mg" },
      { label: "Magnesiumbisglycinat", amount: "–" },
      { label: "Magnesiummalat", amount: "–" },
      { label: "Magnesiumtaurat", amount: "–" },
      { label: "Trimagnesiumdicitrat", amount: "–" },
    ],
  },
];

function getFlavorImage(item: typeof COMBO_ITEMS[0], flavor: string): string {
  return item.flavorImages[flavor] || item.image;
}

const GALLERY_IMAGES = [
  { src: COMBO_HERO, label: "ESN Elite Leistung Bundle" },
  ...COMBO_ITEMS.map(i => ({ src: i.image, label: i.name })),
];

const COMBO_PRICE = 69.0;
const ORIGINAL_PRICE = 129.9;
const DISCOUNT_PCT = Math.round((1 - COMBO_PRICE / ORIGINAL_PRICE) * 100);

/* ── Dropdown flavor selector with thumbnails ── */
function FlavorDropdown({
  flavorImageMap,
  flavors,
  selected,
  onSelect,
  placeholder,
}: {
  flavorImageMap: Record<string, string>;
  flavors: string[];
  selected: string;
  onSelect: (f: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="flavor-dropdown" ref={ref}>
      <button
        type="button"
        className="flavor-dropdown__trigger"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flavor-dropdown__trigger-content">
          {placeholder ? (
            <span className="flavor-dropdown__placeholder">{placeholder}</span>
          ) : (
            <img src={flavorImageMap[selected]} alt={selected} className="flavor-dropdown__trigger-img" />
          )}
          <span>{placeholder || selected}</span>
        </span>
        <svg className={`flavor-dropdown__chevron ${open ? "open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="flavor-dropdown__list">
          {flavors.map(f => (
            <button
              key={f}
              type="button"
              className={`flavor-dropdown__option ${f === selected ? "active" : ""}`}
              onClick={() => { onSelect(f); setOpen(false); }}
            >
              <img src={flavorImageMap[f]} alt={f} className="flavor-dropdown__option-img" />
              <span className="flavor-dropdown__option-name">{f}</span>
              {f === selected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Flavor selector per product ── */
function ProductFlavorSelector({
  item,
  selected,
  onSelect,
}: {
  item: typeof COMBO_ITEMS[0];
  selected: string;
  onSelect: (f: string) => void;
}) {
  if (item.flavors.length <= 1) {
    return (
      <div className="flavor-static">
        <span className="flavor-static__inner">
          <img src={getFlavorImage(item, selected)} alt={selected} className="flavor-static__img" />
          <span>{selected || item.flavors[0]}</span>
        </span>
      </div>
    );
  }

  if (!selected) {
    return (
      <FlavorDropdown
        flavorImageMap={item.flavorImages}
        flavors={item.flavors}
        selected={item.flavors[0]}
        onSelect={onSelect}
        placeholder="Geschmack wählen"
      />
    );
  }

  return (
    <FlavorDropdown
      flavorImageMap={item.flavorImages}
      flavors={item.flavors}
      selected={selected}
      onSelect={onSelect}
    />
  );
}

/* ── Accordion ── */
function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overlay-item">
      <button
        type="button"
        className="overlay-btn"
        onClick={() => setOpen(o => !o)}
      >
        <span className="overlay-btn__icon">
          <svg viewBox="0 0 24 24" style={{
            width: 20, height: 20, transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "none",
          }}>
            <path d="M2.75 12a1 1 0 011-1h16.5a1 1 0 110 2H3.75a1 1 0 01-1-1Z" fill="currentColor" />
            <path d="M12 2.75a1 1 0 011 1v16.5a1 1 0 11-2 0V3.75a1 1 0 011-1Z" fill="currentColor" />
          </svg>
        </span>
        <span className="overlay-btn__label">
          <span className="text-desktop">{title}</span>
          <span className="text-mobile">{title}</span>
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? "4000px" : "0",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease, opacity 0.3s ease",
        }}
      >
        <div className="overlay-content">{children}</div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ComboProduct() {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    COMBO_ITEMS.forEach(i => { init[i.key] = i.flavors.length > 1 ? "" : i.flavors[0]; });
    return init;
  });
  const [flavorError, setFlavorError] = useState<string | null>(null);

  const missingFlavors = useMemo(() => {
    return COMBO_ITEMS.filter(i => i.flavors.length > 1 && !selections[i.key]);
  }, [selections]);

  const handleCheckout = useCallback(() => {
    setFlavorError(null);
    if (missingFlavors.length > 0) {
      setFlavorError(missingFlavors[0].key);
      const el = document.querySelector(`[data-flavor-group="${missingFlavors[0].key}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el?.querySelector(".flavor-dropdown__trigger, .flavor-static") as HTMLElement)?.click();
      return;
    }
    window.location.href = "https://checkout.flowspays.com/checkout/cmodkt6sb00i31rp0obulz7pa?offer=ZW5X4XQ";
  }, [missingFlavors]);

  const handleSelect = useCallback((key: string, flavor: string) => {
    setSelections(prev => ({ ...prev, [key]: flavor }));
    const idx = COMBO_ITEMS.findIndex(i => i.key === key);
    if (idx >= 0) setGalleryIdx(idx + 1);
  }, []);

  return (
    <>
    <div className="combo-page">
      <HeaderESN hideCart />

      {/* ── Main ── */}
      <section className="combo-main">
        <div className="combo-wrapper">
          <div className="combo-layout">

            {/* ── Gallery ── */}
            <div className="combo-gallery">
              {/* Main image */}
              <div className="combo-gallery__main">
                <div className="combo-gallery__ratio">
                  <img
                    src={GALLERY_IMAGES[galleryIdx].src}
                    alt={GALLERY_IMAGES[galleryIdx].label}
                    className="combo-gallery__img"
                  />
                </div>
                <button
                  className="combo-gallery__arrow combo-gallery__arrow--prev"
                  onClick={() => setGalleryIdx(p => (p > 0 ? p - 1 : GALLERY_IMAGES.length - 1))}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="combo-gallery__arrow combo-gallery__arrow--next"
                  onClick={() => setGalleryIdx(p => (p < GALLERY_IMAGES.length - 1 ? p + 1 : 0))}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Thumbnails - desktop left sidebar */}
              <div className="combo-gallery__thumbs-side">
                {GALLERY_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    className={`combo-gallery__thumb ${i === galleryIdx ? "is-active" : ""}`}
                    onClick={() => setGalleryIdx(i)}
                  >
                    <img src={img.src} alt={img.label} />
                  </button>
                ))}
              </div>

              {/* Thumbnails - mobile bottom row */}
              <div className="combo-gallery__thumbs-mobile">
                {GALLERY_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    className={`combo-gallery__thumb ${i === galleryIdx ? "is-active" : ""}`}
                    onClick={() => setGalleryIdx(i)}
                  >
                    <img src={img.src} alt={img.label} />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Buy box ── */}
            <div className="combo-buybox">
              <h1 className="combo-title">ESN Elite Leistung Bundle – Muskelaufbau &amp; Performance</h1>

              {/* Stars */}
              <a href="#reviews" className="combo-stars">
                <div className="combo-stars__row">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="combo-stars__star" viewBox="0 0 20 20">
                      <path d="m10.002 14.774 4.275 2.629a.656.656 0 0 0 .978-.717l-1.163-4.905 3.805-3.282a.662.662 0 0 0-.374-1.154l-4.993-.406-1.923-4.657a.654.654 0 0 0-1.21 0L7.474 6.94l-4.993.406a.661.661 0 0 0-.375 1.158l3.805 3.282-1.162 4.901a.656.656 0 0 0 .978.717z" fill="#f59e0b" />
                    </svg>
                  ))}
                </div>
              </a>

              {/* USPs */}
              <ul className="combo-usp-list">
                <li>
                  <svg className="combo-usp__check" viewBox="0 0 24 24"><path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="currentColor" /></svg>
                  <span>8 Premium-Produkte in einem Bundle</span>
                </li>
                <li>
                  <svg className="combo-usp__check" viewBox="0 0 24 24"><path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="currentColor" /></svg>
                  <span>Über {DISCOUNT_PCT}% Ersparnis gegenüber Einzelkauf</span>
                </li>
                <li>
                  <svg className="combo-usp__check" viewBox="0 0 24 24"><path d="M20.957 6.043a1 1 0 010 1.415l-10.5 10.5a1 1 0 01-1.414 0l-5.25-5.25a1 1 0 111.414-1.415l4.543 4.543 9.793-9.793a1 1 0 011.414 0Z" fill="currentColor" /></svg>
                  <span>Laborgeprüfte Qualität · Made in Germany</span>
                </li>
              </ul>

              {/* Price */}
              <div className="combo-price">
                <span className="combo-price__current">€{COMBO_PRICE.toFixed(2).replace(".", ",")}</span>
                <span className="combo-price__original">€{ORIGINAL_PRICE.toFixed(2).replace(".", ",")}</span>
                <span className="combo-price__note">inkl. MwSt. zzgl. Versand.</span>
              </div>

              {/* Flavor selectors - each product has its own */}
              {flavorError && (
                <div className="combo-flavor-error">
                  Wähle bitte einen Geschmack für: {missingFlavors.map(f => f.name).join(", ")}
                </div>
              )}
              <div className="combo-options">
                {COMBO_ITEMS.map(item => (
                  <div key={item.key} className={`combo-option-group ${flavorError === item.key ? "has-error" : ""}`} data-flavor-group={item.key}>
                    <label className="combo-option__label">
                      {item.name}
                      {item.flavors.length > 1 && <span className="combo-option__required">*</span>}
                    </label>
                    <ProductFlavorSelector
                      item={item}
                      selected={selections[item.key]}
                      onSelect={f => {
                        handleSelect(item.key, f);
                        setFlavorError(null);
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Buy Now button */}
              <button
                className="combo-atc combo-atc--buynow"
                type="button"
                onClick={handleCheckout}
              >
                <span className="combo-atc__desktop">
                  Jetzt kaufen
                </span>
                <span className="combo-atc__mobile">
                  Jetzt kaufen
                </span>
              </button>

              {/* Delivery */}
              <div className="combo-delivery">
                <svg className="combo-delivery__icon" viewBox="0 0 24 17" fill="#1C6C3C">
                  <path d="M15.5 2.5a1 1 0 011-1h3.992a1.75 1.75 0 011.625 1.1l-.928.371.928-.37 1.311 3.278A1 1 0 0122.5 7.25h-6a1 1 0 01-1-1zm2 1v1.75h3.523l-.7-1.75zM.5 8.5a1 1 0 011-1h15a1 1 0 110 2h-15a1 1 0 01-1-1M17.625 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5M14.375 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0M6.375 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5M3.125 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0" />
                  <path d="M7.625 13a1 1 0 011-1h6.75a1 1 0 110 2h-6.75a1 1 0 01-1-1" />
                  <path d="M2.5 2v10h1.625a1 1 0 110 2H2.25A1.75 1.75 0 01.5 12.25V1.75A1.75 1.75 0 012.25 0H16.5a1 1 0 011 1v10.051a1 1 0 11-2 0V2z" />
                  <path d="M15.5 6.25a1 1 0 011-1h6a1 1 0 011 1v6A1.75 1.75 0 0121.75 14h-1.875a1 1 0 110-2H21.5V7.25h-4v3.801a1 1 0 11-2 0z" />
                </svg>
                <span>Lieferzeit: 3-5 Werktage</span>
              </div>

              {/* Accordion */}
              <div className="combo-accordion">
                <AccordionSection title="Beschreibung">
                  <p>
                    Das <strong>ESN Elite Leistung Bundle</strong> ist das ultimative Paket für ambitionierte Athleten.
                    8 Premium-Produkte, perfekt aufeinander abgestimmt.
                  </p>
                  <h3>Inhalt des Combos</h3>
                  {COMBO_ITEMS.map((item, i) => (
                    <div key={item.key} className="combo-row">
                      <div className="combo-row__thumb">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="combo-row__info">
                        <span className="combo-row__num">{i + 1}</span>
                        <div>
                          <div className="combo-row__name">{item.name}</div>
                          <div className="combo-row__size">{item.subtitle}</div>
                          <div className="combo-row__flavors">
                            {item.flavors.length > 1
                              ? `Geschmack: ${item.flavors.join(", ")}`
                              : item.flavors[0] !== "Standard"
                              ? `Geschmack: ${item.flavors[0]}`
                              : "Standardvariante"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="combo-highlight">
                    <strong>Dein Vorteil:</strong> Spare über {DISCOUNT_PCT}% gegenüber dem Einzelkauf –
                    alle Produkte laborgeprüft und Made in Germany.
                  </div>
                </AccordionSection>
                <AccordionSection title="Nährwerte">
                  {NUTRITION_DATA.map((n) => (
                    <div key={n.product} className="nutrition-card">
                      <div className="nutrition-card__header">
                        <div className="nutrition-card__thumb">
                          <img src={COMBO_ITEMS.find(i => i.key === n.productKey)?.image} alt={n.product} />
                        </div>
                        <div className="nutrition-card__title">{n.product}</div>
                        <div className="nutrition-card__portion-info">{n.portionInfo}</div>
                      </div>
                      <table className="nutrition-table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>pro 100g</th>
                            <th>pro Portion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {n.rows.map((row, i) => (
                            <tr key={i}>
                              <td>{row.label}</td>
                              <td>{row.per100g}</td>
                              <td>{row.perPortion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {n.activeIngredients && (
                        <table className="nutrition-table nutrition-table--ingredients">
                          <thead>
                            <tr><th>Aktive Inhaltsstoffe</th><th>pro Portion</th></tr>
                          </thead>
                          <tbody>
                            {n.activeIngredients.map((row, i) => (
                              <tr key={i}>
                                <td>{row.label}</td>
                                <td>{row.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  ))}
                </AccordionSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's inside ── */}
      <section className="combo-whats">
        <div className="combo-wrapper">
          <h2 className="combo-whats__title">Was im Bundle enthalten ist</h2>
          <div className="combo-whats__grid">
            {COMBO_ITEMS.map(item => (
              <div
                key={item.key}
                className="combo-whats__card"
                onClick={() => navigate(`/products/${item.slug}`)}
              >
                <div className="combo-whats__img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="combo-whats__name">{item.name}</div>
                <div className="combo-whats__sub">{item.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

    <FooterESN />

    <style>{`
        /* ── Reset (scoped to combo-page) ── */
        .combo-page *, .combo-page *::before, .combo-page *::after { box-sizing: border-box; }

        /* ── Prevent horizontal overflow ── */
        html, body { overflow-x: hidden; width: 100%; }

        /* ── Base ── */
        .combo-page {
          min-height: 100vh;
          background: #fff;
          color: #000;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
        }
        .combo-wrapper {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 16px;
        }

        /* ── Announcement ── */
        .combo-announcement {
          background: #b70832;
          color: #fff;
          padding: 8px 12px;
          text-align: center;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3px;
          line-height: 1.4;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        @media (max-width: 479px) {
          .combo-announcement { font-size: 9px; padding: 7px 8px; }
        }

        /* ── Main layout ── */
        .combo-main {
          padding: 32px 0 48px;
        }
        .combo-layout {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .combo-main { padding: 48px 0 80px; }
          .combo-layout {
            display: grid;
            grid-template-columns: minmax(0, 58%) minmax(0, 42%);
            gap: 48px;
          }
        }

        /* ── Gallery ── */
        .combo-gallery {
          position: relative;
        }
        .combo-gallery__main {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
          background: #ebeff0;
        }
        .combo-gallery__ratio {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
        }
        .combo-gallery__img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .combo-gallery__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(0, 0, 0, 0.6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          padding: 0;
        }
        .combo-gallery__arrow:hover { background: rgba(0, 0, 0, 0.85); }
        .combo-gallery__arrow--prev { left: 8px; }
        .combo-gallery__arrow--next { right: 8px; }

        .combo-gallery__thumbs-side {
          display: none;
        }
        .combo-gallery__thumbs-mobile {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
          scroll-snap-type: x mandatory;
        }
        .combo-gallery__thumbs-mobile::-webkit-scrollbar { display: none; }

        @media (max-width: 767px) {
          .combo-gallery__arrow { width: 32px; height: 32px; }
          .combo-gallery__arrow--prev { left: 4px; }
          .combo-gallery__arrow--next { right: 4px; }
          .combo-gallery__thumb { width: 48px; height: 48px; min-width: 48px; }
        }

        @media (min-width: 1024px) {
          .combo-gallery {
            display: grid;
            grid-template-columns: 70px 1fr;
            gap: 16px;
            align-items: start;
          }
          .combo-gallery__main { grid-column: 2; border-radius: 16px; }
          .combo-gallery__thumbs-side {
            display: flex;
            flex-direction: column;
            gap: 10px;
            grid-column: 1;
            grid-row: 1;
            align-self: start;
            max-height: 500px;
            overflow-y: auto;
            scrollbar-width: thin;
            padding-right: 4px;
          }
          .combo-gallery__thumbs-mobile { display: none; }
          .combo-gallery__arrow { width: 40px; height: 40px; }
          .combo-gallery__arrow--prev { left: 12px; }
          .combo-gallery__arrow--next { right: 12px; }
        }

        .combo-gallery__thumb {
          width: 56px;
          height: 56px;
          min-width: 56px;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.15s;
          padding: 0;
          overflow: hidden;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
          -webkit-tap-highlight-color: transparent;
        }
        .combo-gallery__thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .combo-gallery__thumb.is-active {
          opacity: 1;
          border-color: #000;
        }

        /* ── Buy box ── */
        .combo-buybox {
          background: #fff;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .combo-buybox {
            position: sticky;
            top: 100px;
          }
        }

        .combo-title {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        @media (min-width: 768px) {
          .combo-title { font-size: 24px; }
        }
        @media (min-width: 1024px) {
          .combo-title { font-size: 28px; }
        }

        .combo-stars { text-decoration: none; color: inherit; display: inline-block; margin-bottom: 14px; }
        .combo-stars__row { display: flex; gap: 2px; }
        .combo-stars__star { width: 14px; height: 14px; }
        @media (min-width: 768px) {
          .combo-stars__star { width: 16px; height: 16px; }
        }

        .combo-usp-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .combo-usp-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          line-height: 1.3;
        }
        .combo-usp__check {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
          margin-top: 1px;
          color: #000;
        }
        @media (min-width: 768px) {
          .combo-usp-list { gap: 8px; margin-bottom: 24px; }
          .combo-usp-list li { font-size: 14px; }
          .combo-usp__check { width: 16px; height: 16px; }
        }

        /* Price */
        .combo-price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 20px;
        }
        .combo-price__current {
          font-size: 22px;
          font-weight: 700;
          color: #000;
        }
        .combo-price__original {
          color: #b3b3b3;
          text-decoration: line-through;
          font-size: 14px;
        }
        .combo-price__note {
          width: 100%;
          font-size: 11px;
          color: #757575;
        }
        @media (min-width: 768px) {
          .combo-price { margin-bottom: 24px; }
          .combo-price__current { font-size: 24px; }
          .combo-price__original { font-size: 16px; }
          .combo-price__note { font-size: 12px; }
        }

        /* Options */
        .combo-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }
        .combo-option-group { display: flex; flex-direction: column; gap: 6px; }
        .combo-option-group.has-error .flavor-dropdown__trigger {
          border-color: #e74c3c;
          box-shadow: 0 0 0 2px rgba(231,76,60,0.2);
        }
        .combo-option__label {
          font-size: 12px;
          font-weight: 700;
          color: #000;
        }
        .combo-option__required { color: #e74c3c; margin-left: 4px; }
        .combo-flavor-error {
          background: #fde8e8;
          color: #c0392b;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
          border: 1px solid #f5c6cb;
        }
        @media (min-width: 768px) {
          .combo-options { gap: 20px; margin-bottom: 24px; }
          .combo-option-group { gap: 8px; }
          .combo-option__label { font-size: 13px; }
        }

        /* ── Flavor dropdown ── */
        .flavor-dropdown { position: relative; }
        .flavor-dropdown__trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border: 1.5px solid #dedede;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: border-color 0.2s;
          color: #000;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
          text-align: left;
          -webkit-tap-highlight-color: transparent;
        }
        .flavor-dropdown__trigger:hover { border-color: #000; }
        .flavor-dropdown__trigger:active { border-color: #000; background: #f8f9fa; }
        .flavor-dropdown__trigger-content {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .flavor-dropdown__placeholder {
          color: #999;
          font-weight: 400;
          font-style: italic;
        }
        .flavor-dropdown__trigger-img {
          width: 28px;
          height: 28px;
          min-width: 28px;
          object-fit: contain;
          border-radius: 4px;
        }
        .flavor-dropdown__chevron { transition: transform 0.2s; color: #757575; flex-shrink: 0; margin-left: 8px; }
        .flavor-dropdown__chevron.open { transform: rotate(180deg); }
        .flavor-dropdown__list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1.5px solid #dedede;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          z-index: 50;
          overflow: hidden;
          max-height: 240px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 767px) {
          .flavor-dropdown__list {
            max-height: 220px;
          }
        }
        .flavor-dropdown__option {
          width: 100%;
          padding: 8px 12px;
          background: #fff;
          border: none;
          border-bottom: 1px solid #edf1f2;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #000;
          transition: background 0.15s;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .flavor-dropdown__option-img {
          width: 32px;
          height: 32px;
          min-width: 32px;
          object-fit: contain;
          border-radius: 4px;
        }
        .flavor-dropdown__option-name {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .flavor-dropdown__option:hover { background: #edf1f2; }
        .flavor-dropdown__option:active { background: #e0e4e5; }
        .flavor-dropdown__option.active { background: #edf1f2; font-weight: 700; }

        .flavor-static {
          padding: 8px 12px;
          border: 1.5px solid #edf1f2;
          border-radius: 8px;
          background: #edf1f2;
          font-size: 13px;
          color: #757575;
          font-weight: 500;
        }
        .flavor-static__inner {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .flavor-static__img {
          width: 28px;
          height: 28px;
          min-width: 28px;
          object-fit: contain;
          border-radius: 4px;
        }

        /* Add to cart */
        .combo-atc {
          width: 100%;
          padding: 14px 24px;
          border: none;
          border-radius: 50px;
          background: #4ec3e0;
          color: #000;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(78,195,224,0.3);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          -webkit-tap-highlight-color: transparent;
          font-family: 'Wix Madefor Text', Helvetica, Arial, sans-serif;
        }
        .combo-atc:hover { opacity: 0.9; }
        .combo-atc:active { transform: scale(0.98); }
        .combo-atc--success {
          background: #2db463;
          box-shadow: 0 4px 16px rgba(45,180,99,0.3);
          color: #fff;
        }
        .combo-atc__mobile { display: none; }
        @media (max-width: 767px) {
          .combo-atc { min-height: 54px; font-size: 13px; }
          .combo-atc__desktop { display: none; }
          .combo-atc__mobile { display: inline; font-weight: 700; font-size: 14px; }
        }
        @media (min-width: 768px) {
          .combo-atc { min-height: 56px; font-size: 15px; padding: 16px 24px; }
        }

        /* Delivery */
        .combo-delivery {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: #e8f5ee;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 20px;
        }
        .combo-delivery__icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        @media (min-width: 768px) {
          .combo-delivery { font-size: 13px; margin-bottom: 24px; }
          .combo-delivery__icon { width: 24px; height: 24px; }
        }

        /* Accordion */
        .combo-accordion {
          border-top: 2px solid #dedede;
        }
        .overlay-item { border-bottom: 2px solid #dedede; }
        .overlay-btn {
          appearance: none;
          background: transparent;
          border: none;
          color: inherit;
          cursor: pointer;
          font: inherit;
          outline: none;
          padding: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          -webkit-tap-highlight-color: transparent;
        }
        .overlay-btn:active { opacity: 0.7; }
        .overlay-btn__label {
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .overlay-btn__icon { order: 1; color: #757575; flex-shrink: 0; }
        .overlay-btn__icon svg { height: 18px; width: 18px; }
        .overlay-content {
          padding: 0 0 20px;
          font-size: 13px;
          line-height: 1.6;
          color: #333;
        }
        .overlay-content p { margin: 0 0 10px; }
        .overlay-content strong { color: #000; }
        .overlay-content h3 {
          margin: 14px 0 10px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          color: #000;
        }
        @media (min-width: 768px) {
          .overlay-btn { padding: 16px 0; }
          .overlay-btn__label { font-size: 14px; }
          .overlay-btn__icon svg { height: 20px; width: 20px; }
          .overlay-content { padding: 0 0 24px; font-size: 14px; }
        }

        /* Combo rows */
        .combo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #edf1f2;
        }
        .combo-row:last-of-type { border-bottom: none; }
        .combo-row__thumb {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: #ebeff0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .combo-row__thumb img { width: 100%; height: 100%; object-fit: contain; }
        .combo-row__info {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .combo-row__num {
          width: 20px;
          height: 20px;
          min-width: 20px;
          background: #000;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          margin-top: 1px;
        }
        .combo-row__name {
          font-size: 12px;
          font-weight: 700;
          color: #000;
          line-height: 1.3;
        }
        .combo-row__size {
          font-size: 10px;
          color: #757575;
          margin-top: 1px;
        }
        .combo-row__flavors {
          font-size: 10px;
          color: #757575;
          margin-top: 1px;
          line-height: 1.4;
        }
        .combo-highlight {
          margin-top: 12px;
          padding: 12px;
          background: #e8f5ee;
          border-radius: 8px;
          font-size: 12px;
          line-height: 1.5;
        }
        .combo-highlight strong { color: #2db463; }
        @media (min-width: 768px) {
          .combo-row { gap: 12px; padding: 12px 0; }
          .combo-row__thumb { width: 48px; height: 48px; min-width: 48px; border-radius: 8px; }
          .combo-row__num { width: 22px; height: 22px; min-width: 22px; font-size: 11px; }
          .combo-row__name { font-size: 13px; }
          .combo-row__size, .combo-row__flavors { font-size: 11px; }
          .combo-highlight { padding: 16px; font-size: 13px; margin-top: 16px; }
        }

        /* Nutrition cards */
        .nutrition-card {
          margin-bottom: 20px;
          border: 1.5px solid #edf1f2;
          border-radius: 10px;
          overflow: hidden;
        }
        .nutrition-card__header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #f8f9fa;
          border-bottom: 1px solid #edf1f2;
        }
        .nutrition-card__thumb {
          width: 40px;
          height: 40px;
          min-width: 40px;
          background: #ebeff0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .nutrition-card__thumb img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .nutrition-card__title {
          flex: 1;
          font-size: 12px;
          font-weight: 700;
          color: #000;
        }
        .nutrition-card__portion-info {
          font-size: 10px;
          color: #757575;
          text-align: right;
          white-space: nowrap;
        }
        .nutrition-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
        }
        .nutrition-table th {
          text-align: left;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 9px;
          padding: 6px 10px;
          border-bottom: 2px solid #000;
          color: #000;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }
        .nutrition-table th:last-child {
          text-align: right;
        }
        .nutrition-table th:nth-child(2) {
          text-align: center;
        }
        .nutrition-table td {
          padding: 5px 10px;
          border-bottom: 1px solid #edf1f2;
          color: #333;
          white-space: nowrap;
        }
        .nutrition-table td:last-child {
          text-align: right;
          font-weight: 600;
        }
        .nutrition-table td:nth-child(2) {
          text-align: center;
          color: #757575;
        }
        .nutrition-table td:first-child {
          color: #333;
        }
        .nutrition-table--ingredients {
          border-top: 2px solid #edf1f2;
        }
        .nutrition-table--ingredients thead {
          background: #f8f9fa;
        }
        @media (min-width: 768px) {
          .nutrition-card { margin-bottom: 24px; }
          .nutrition-card__header { padding: 12px 16px; gap: 14px; }
          .nutrition-card__thumb { width: 48px; height: 48px; min-width: 48px; border-radius: 8px; }
          .nutrition-card__title { font-size: 14px; }
          .nutrition-card__portion-info { font-size: 11px; }
          .nutrition-table { font-size: 12px; }
          .nutrition-table th { font-size: 10px; padding: 8px 14px; }
          .nutrition-table td { padding: 6px 14px; }
        }

        /* ── What's inside ── */
        .combo-whats {
          margin-top: 48px;
          padding: 40px 0 48px;
          background: #000;
        }
        .combo-whats__title {
          font-size: 18px;
          font-weight: 800;
          text-transform: uppercase;
          text-align: center;
          margin: 0 0 24px;
          letter-spacing: 0.3px;
          padding: 0 16px;
          line-height: 1.3;
          color: #fff;
        }
        .combo-whats__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .combo-whats__card {
          background: #fff;
          border-radius: 8px;
          padding: 10px 6px;
          text-align: center;
          border: 1.5px solid #edf1f2;
          cursor: pointer;
          transition: all 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .combo-whats__card:hover {
          border-color: #000;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .combo-whats__card:active {
          transform: scale(0.97);
          border-color: #000;
        }
        .combo-whats__img {
          width: 52px;
          height: 52px;
          margin: 0 auto 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .combo-whats__img img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .combo-whats__name {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.3;
          margin-bottom: 3px;
          color: #000;
        }
        .combo-whats__sub { font-size: 9px; color: #757575; }
        @media (min-width: 480px) {
          .combo-whats__title { font-size: 20px; margin-bottom: 28px; }
          .combo-whats__grid { gap: 12px; }
          .combo-whats__card { padding: 12px 8px; }
          .combo-whats__img { width: 60px; height: 60px; }
          .combo-whats__name { font-size: 10px; }
          .combo-whats__sub { font-size: 10px; }
        }
        @media (min-width: 768px) {
          .combo-whats { margin-top: 64px; padding: 48px 0 64px; }
          .combo-whats__title { font-size: 22px; margin-bottom: 32px; }
          .combo-whats__grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
          .combo-whats__card { padding: 14px 10px; }
          .combo-whats__img { width: 64px; height: 64px; margin-bottom: 8px; }
        }
        @media (min-width: 1024px) {
          .combo-whats__grid { grid-template-columns: repeat(8, 1fr); }
        }

        /* ── Very small screens ── */
        @media (max-width: 359px) {
          .combo-whats__grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
          .combo-whats__name { font-size: 8px; }
          .combo-whats__sub { font-size: 8px; }
        }

        /* ── Visually hidden ── */
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* ── Mobile text ── */
        .text-mobile { display: inline; }
        .text-desktop { display: none; }
        @media (min-width: 1024px) {
          .text-mobile { display: none; }
          .text-desktop { display: inline; }
        }
      `}</style>
    </>
  );
}
