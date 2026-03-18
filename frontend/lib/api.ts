export interface Product {
  id: number;
  artisan_id: number;
  nom: string;
  description: string;
  prix_fcfa: number;
  image_url: string;
  is_available: boolean;
  telephone_whatsapp?: string;
}

export interface CultureContent {
  id: number;
  type_contenu: "conte" | "histoire" | "site_touristique";
  titre: string;
  contenu_texte: string;
  image_url: string | null;
  audio_url: string | null;
}

export interface LanguageLesson {
  id: number;
  categorie: "vocabulaire" | "expression" | "grammaire";
  mot_francais: string;
  traduction_bambara: string;
  exemple_francais: string;
  exemple_bambara: string;
  audio_prononciation_url: string | null;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
const DEFAULT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+223 72 88 41 07";

export function formatFcfa(amount: number): string {
  const formatted = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} FCFA`;
}

export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

export function getWhatsAppNumber(product: Product): string {
  const rawNumber = product.telephone_whatsapp ?? DEFAULT_WHATSAPP_NUMBER;
  return normalizeWhatsAppNumber(rawNumber);
}

export function buildProductWhatsAppLink(product: Product): string {
  const numero = getWhatsAppNumber(product);
  if (!numero) {
    return "";
  }

  const prix = formatFcfa(product.prix_fcfa);
  const message = `Bonjour, je veux acheter "${product.nom}" (${prix}) via An ka dambe.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Erreur API: impossible de charger le catalogue (HTTP ${response.status}).`,
    );
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Erreur API: format invalide (tableau attendu).");
  }

  return data as Product[];
}

export async function getProduct(productId: number): Promise<Product | null> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Erreur API: impossible de charger le produit ${productId} (HTTP ${response.status}).`,
    );
  }

  const data: unknown = await response.json();
  if (!data || typeof data !== "object") {
    throw new Error("Erreur API: format invalide (objet attendu).");
  }

  return data as Product;
}

export async function getCultureContents(): Promise<CultureContent[]> {
  const response = await fetch(`${API_BASE_URL}/culture/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Erreur API: impossible de charger les contenus culturels (HTTP ${response.status}).`,
    );
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Erreur API: format invalide (tableau attendu).");
  }

  return data as CultureContent[];
}

export async function getLanguageLessons(): Promise<LanguageLesson[]> {
  const response = await fetch(`${API_BASE_URL}/languages/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Erreur API: impossible de charger les leçons de langue (HTTP ${response.status}).`,
    );
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Erreur API: format invalide (tableau attendu).");
  }

  return data as LanguageLesson[];
}
