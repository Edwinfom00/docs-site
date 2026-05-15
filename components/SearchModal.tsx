'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  href: string;
  section: string;
  description?: string;
}

// Static search index — in a real app this would be generated at build time
const SEARCH_INDEX_EN: SearchResult[] = [
  // ── @edwinfom/resume-intel v0.2.1 ────────────────────────────────────────
  { title: 'Introduction', href: '/docs/resume-intel/v0.2.1/en/introduction', section: 'resume-intel · Getting Started', description: 'LLM-first resume parsing — v0.2.1 with PII redaction' },
  { title: 'Installation', href: '/docs/resume-intel/v0.2.1/en/installation', section: 'resume-intel · Getting Started', description: 'Install with npm or pnpm, choose your AI provider' },
  { title: 'Quick Start', href: '/docs/resume-intel/v0.2.1/en/quick-start', section: 'resume-intel · Getting Started', description: 'Parse your first resume PDF in under 5 minutes' },
  { title: 'Spatial Extraction', href: '/docs/resume-intel/v0.2.1/en/spatial-extraction', section: 'resume-intel · Core Pipeline', description: 'Bounding box algorithm for multi-column layouts' },
  { title: 'OCR Fallback', href: '/docs/resume-intel/v0.2.1/en/ocr-fallback', section: 'resume-intel · Core Pipeline', description: 'Automatic OCR for scanned PDFs via Tesseract.js' },
  { title: 'Task Decomposition', href: '/docs/resume-intel/v0.2.1/en/task-decomposition', section: 'resume-intel · Core Pipeline', description: 'Parallel per-section LLM extraction — 15 sections' },
  { title: 'JSON Validation', href: '/docs/resume-intel/v0.2.1/en/json-validation', section: 'resume-intel · Core Pipeline', description: 'jsonrepair + Zod + self-correcting retry loop' },
  { title: 'DeepSeek', href: '/docs/resume-intel/v0.2.1/en/provider-deepseek', section: 'resume-intel · Providers', description: 'Best cost/performance ratio for extraction' },
  { title: 'OpenAI', href: '/docs/resume-intel/v0.2.1/en/provider-openai', section: 'resume-intel · Providers', description: 'GPT-4o-mini and GPT-4o' },
  { title: 'Anthropic', href: '/docs/resume-intel/v0.2.1/en/provider-anthropic', section: 'resume-intel · Providers', description: 'Claude 3.5 Haiku and Sonnet' },
  { title: 'Ollama (Local)', href: '/docs/resume-intel/v0.2.1/en/provider-ollama', section: 'resume-intel · Providers', description: 'Run locally, no API key, no data leaves your machine' },
  { title: 'API Reference', href: '/docs/resume-intel/v0.2.1/en/api-reference', section: 'resume-intel · Reference', description: 'parseResume(), streamResume(), redactPii, options, return types' },
  { title: 'Streaming', href: '/docs/resume-intel/v0.2.1/en/streaming', section: 'resume-intel · Reference', description: 'streamResume() — progressive section-by-section updates' },
  { title: 'PII Redaction', href: '/docs/resume-intel/v0.2.1/en/pii-redaction', section: 'resume-intel · Reference', description: 'Redact email, phone, addresses before LLM — GDPR-friendly' },
  { title: 'Output Schema', href: '/docs/resume-intel/v0.2.1/en/output-schema', section: 'resume-intel · Reference', description: 'JSON Resume v1 specification' },
  { title: 'CLI', href: '/docs/resume-intel/v0.2.1/en/cli', section: 'resume-intel · Reference', description: 'resume-intel parse <file.pdf> — parse from the terminal' },
  { title: 'Error Handling', href: '/docs/resume-intel/v0.2.1/en/error-handling', section: 'resume-intel · Reference', description: 'ResumeExtractionError, OcrNotEnabledError' },
  { title: 'Changelog', href: '/docs/resume-intel/v0.2.1/en/changelog', section: 'resume-intel · Reference', description: 'Release history — v0.2.1, v0.2.0, v0.1.3, v0.1.2, v0.1.0' },
  // ── @edwinfom/resume-intel v0.2.0 ────────────────────────────────────────
  { title: 'Introduction (v0.2.0)', href: '/docs/resume-intel/v0.2.0/en/introduction', section: 'resume-intel · v0.2.0', description: 'streamResume() streaming API' },
  { title: 'Streaming (v0.2.0)', href: '/docs/resume-intel/v0.2.0/en/streaming', section: 'resume-intel · v0.2.0', description: 'streamResume() — progressive section-by-section updates' },
  { title: 'Changelog (v0.2.0)', href: '/docs/resume-intel/v0.2.0/en/changelog', section: 'resume-intel · v0.2.0', description: 'Release notes' },
  // ── @edwinfom/resume-intel v0.1.3 ────────────────────────────────────────
  { title: 'Introduction (v0.1.3)', href: '/docs/resume-intel/v0.1.3/en/introduction', section: 'resume-intel · v0.1.3', description: 'Output normalizer, maxConcurrency, onProgress, ocrLanguage' },
  { title: 'Changelog (v0.1.3)', href: '/docs/resume-intel/v0.1.3/en/changelog', section: 'resume-intel · v0.1.3', description: 'Release notes' },
  // ── @edwinfom/resume-intel v0.1.0 ────────────────────────────────────────
  { title: 'Introduction (v0.1.0)', href: '/docs/resume-intel/v0.1.0/en/introduction', section: 'resume-intel · v0.1.0', description: 'Initial release' },
  { title: 'Changelog (v0.1.0)', href: '/docs/resume-intel/v0.1.0/en/changelog', section: 'resume-intel · v0.1.0', description: 'Initial release notes' },
  // ── @edwinfom/ai-guard v0.2.1 ────────────────────────────────────────────
  { title: 'Introduction', href: '/docs/ai-guard/v0.2.1/en/introduction', section: 'ai-guard · Getting Started', description: 'Overview of @edwinfom/ai-guard' },
  { title: 'Installation', href: '/docs/ai-guard/v0.2.1/en/installation', section: 'ai-guard · Getting Started', description: 'Install with npm, pnpm, yarn or bun' },
  { title: 'Quick Start', href: '/docs/ai-guard/v0.2.1/en/quick-start', section: 'ai-guard · Getting Started', description: 'Get up and running in minutes' },
  { title: 'Schema Enforcement', href: '/docs/ai-guard/v0.2.1/en/schema-enforcement', section: 'ai-guard · Core Features', description: '3-level JSON repair pipeline' },
  { title: 'PII Redaction', href: '/docs/ai-guard/v0.2.1/en/pii-redaction', section: 'ai-guard · Core Features', description: 'Scrub emails, phones, credit cards and more' },
  { title: 'Prompt Injection', href: '/docs/ai-guard/v0.2.1/en/prompt-injection', section: 'ai-guard · Core Features', description: 'Block injection attacks' },
  { title: 'Canary Tokens', href: '/docs/ai-guard/v0.2.1/en/canary-tokens', section: 'ai-guard · Core Features', description: 'Detect system prompt leakage' },
  { title: 'Content Policy', href: '/docs/ai-guard/v0.2.1/en/content-policy', section: 'ai-guard · Core Features', description: 'Toxicity and harmful content detection' },
  { title: 'Hallucination Detection', href: '/docs/ai-guard/v0.2.1/en/hallucination-detection', section: 'ai-guard · Core Features', description: 'RAG grounding check' },
  { title: 'Budget Sentinel', href: '/docs/ai-guard/v0.2.1/en/budget-sentinel', section: 'ai-guard · Core Features', description: 'Token counting, cost limits, custom model pricing' },
  { title: 'Rate Limiter', href: '/docs/ai-guard/v0.2.1/en/rate-limiter', section: 'ai-guard · Core Features', description: 'Per-user sliding-window limits' },
  { title: 'Audit Log', href: '/docs/ai-guard/v0.2.1/en/audit-log', section: 'ai-guard · Advanced', description: 'Structured callback after every call' },
  { title: 'Streaming Support', href: '/docs/ai-guard/v0.2.1/en/streaming', section: 'ai-guard · Advanced', description: 'protectStream() for async streams' },
  { title: 'Dry-run Inspect', href: '/docs/ai-guard/v0.2.1/en/inspect', section: 'ai-guard · Advanced', description: 'Full risk report without blocking' },
  { title: 'Tree-Shakeable Sub-paths', href: '/docs/ai-guard/v0.2.1/en/tree-shaking', section: 'ai-guard · Advanced', description: 'Import only what you need' },
  { title: 'Custom Adapter', href: '/docs/ai-guard/v0.2.1/en/custom-adapter', section: 'ai-guard · Advanced', description: 'Custom response parser' },
  { title: 'Vercel AI SDK', href: '/docs/ai-guard/v0.2.1/en/vercel-adapter', section: 'ai-guard · Integrations', description: 'guardVercelStream adapter' },
  { title: 'LangChain', href: '/docs/ai-guard/v0.2.1/en/langchain-adapter', section: 'ai-guard · Integrations', description: 'createGuardedParser adapter' },
  { title: 'Next.js Example', href: '/docs/ai-guard/v0.2.1/en/nextjs-example', section: 'ai-guard · Integrations', description: 'Complete API route example' },
  { title: 'API Reference', href: '/docs/ai-guard/v0.2.1/en/api-reference', section: 'ai-guard · Reference', description: 'Full Guardian class API' },
  { title: 'Error Types', href: '/docs/ai-guard/v0.2.1/en/error-types', section: 'ai-guard · Reference', description: 'GuardianError, InjectionError, BudgetError...' },
  { title: 'Playground', href: '/docs/ai-guard/v0.2.1/en/playground', section: 'ai-guard · Reference', description: 'Run all standalone tests in your browser' },
  { title: 'Changelog', href: '/docs/ai-guard/v0.2.1/en/changelog', section: 'ai-guard · Reference', description: 'Release history — v0.2.1, v0.2.0' },
  // ── @edwinfom/ai-guard v0.2.0 ────────────────────────────────────────────
  { title: 'Introduction (v0.2.0)', href: '/docs/ai-guard/v0.2.0/en/introduction', section: 'ai-guard · v0.2.0', description: 'Overview of @edwinfom/ai-guard' },
  { title: 'Budget Sentinel (v0.2.0)', href: '/docs/ai-guard/v0.2.0/en/budget-sentinel', section: 'ai-guard · v0.2.0', description: 'Token counting and cost limits' },
  { title: 'Changelog (v0.2.0)', href: '/docs/ai-guard/v0.2.0/en/changelog', section: 'ai-guard · v0.2.0', description: 'Release history' },
];

const SEARCH_INDEX_FR: SearchResult[] = [
  // ── @edwinfom/resume-intel v0.2.1 ────────────────────────────────────────
  { title: 'Introduction', href: '/docs/resume-intel/v0.2.1/fr/introduction', section: 'resume-intel · Démarrage', description: 'Infrastructure de parsing de CV orientée LLM — v0.2.1 avec redaction PII' },
  { title: 'Installation', href: '/docs/resume-intel/v0.2.1/fr/installation', section: 'resume-intel · Démarrage', description: 'Installer avec npm ou pnpm, choisir votre fournisseur IA' },
  { title: 'Démarrage rapide', href: '/docs/resume-intel/v0.2.1/fr/quick-start', section: 'resume-intel · Démarrage', description: 'Parsez votre premier CV PDF en moins de 5 minutes' },
  { title: 'Extraction spatiale', href: '/docs/resume-intel/v0.2.1/fr/spatial-extraction', section: 'resume-intel · Pipeline', description: 'Algorithme de boîtes englobantes pour les mises en page multicolonnes' },
  { title: 'Fallback OCR', href: '/docs/resume-intel/v0.2.1/fr/ocr-fallback', section: 'resume-intel · Pipeline', description: 'OCR automatique pour les PDFs scannés via Tesseract.js' },
  { title: 'Décomposition par section', href: '/docs/resume-intel/v0.2.1/fr/task-decomposition', section: 'resume-intel · Pipeline', description: 'Extraction LLM parallèle — 15 sections disponibles' },
  { title: 'Validation JSON', href: '/docs/resume-intel/v0.2.1/fr/json-validation', section: 'resume-intel · Pipeline', description: 'jsonrepair + Zod + boucle de retry auto-correctrice' },
  { title: 'DeepSeek', href: '/docs/resume-intel/v0.2.1/fr/provider-deepseek', section: 'resume-intel · Fournisseurs', description: 'Meilleur rapport coût/performance pour l\'extraction' },
  { title: 'OpenAI', href: '/docs/resume-intel/v0.2.1/fr/provider-openai', section: 'resume-intel · Fournisseurs', description: 'GPT-4o-mini et GPT-4o' },
  { title: 'Anthropic', href: '/docs/resume-intel/v0.2.1/fr/provider-anthropic', section: 'resume-intel · Fournisseurs', description: 'Claude 3.5 Haiku et Sonnet' },
  { title: 'Ollama (Local)', href: '/docs/resume-intel/v0.2.1/fr/provider-ollama', section: 'resume-intel · Fournisseurs', description: 'Exécution locale, aucune clé API, aucune donnée ne quitte votre machine' },
  { title: 'Référence API', href: '/docs/resume-intel/v0.2.1/fr/api-reference', section: 'resume-intel · Référence', description: 'parseResume(), streamResume(), redactPii, options, types de retour' },
  { title: 'Streaming', href: '/docs/resume-intel/v0.2.1/fr/streaming', section: 'resume-intel · Référence', description: 'streamResume() — mises à jour progressives section par section' },
  { title: 'Redaction PII', href: '/docs/resume-intel/v0.2.1/fr/pii-redaction', section: 'resume-intel · Référence', description: 'Masquer emails, téléphones, adresses avant le LLM — compatible RGPD' },
  { title: 'Schéma de sortie', href: '/docs/resume-intel/v0.2.1/fr/output-schema', section: 'resume-intel · Référence', description: 'Spécification JSON Resume v1' },
  { title: 'CLI', href: '/docs/resume-intel/v0.2.1/fr/cli', section: 'resume-intel · Référence', description: 'resume-intel parse <file.pdf> — parser depuis le terminal' },
  { title: 'Gestion des erreurs', href: '/docs/resume-intel/v0.2.1/fr/error-handling', section: 'resume-intel · Référence', description: 'ResumeExtractionError, OcrNotEnabledError' },
  { title: 'Changelog', href: '/docs/resume-intel/v0.2.1/fr/changelog', section: 'resume-intel · Référence', description: 'Historique des versions — v0.2.1, v0.2.0, v0.1.3, v0.1.2, v0.1.0' },
  // ── @edwinfom/resume-intel v0.2.0 ────────────────────────────────────────
  { title: 'Introduction (v0.2.0)', href: '/docs/resume-intel/v0.2.0/fr/introduction', section: 'resume-intel · v0.2.0', description: 'API streaming streamResume()' },
  { title: 'Streaming (v0.2.0)', href: '/docs/resume-intel/v0.2.0/fr/streaming', section: 'resume-intel · v0.2.0', description: 'streamResume() — mises à jour progressives section par section' },
  { title: 'Changelog (v0.2.0)', href: '/docs/resume-intel/v0.2.0/fr/changelog', section: 'resume-intel · v0.2.0', description: 'Notes de version' },
  // ── @edwinfom/resume-intel v0.1.3 ────────────────────────────────────────
  { title: 'Introduction (v0.1.3)', href: '/docs/resume-intel/v0.1.3/fr/introduction', section: 'resume-intel · v0.1.3', description: 'Normaliseur de sortie, maxConcurrency, onProgress, ocrLanguage' },
  { title: 'Changelog (v0.1.3)', href: '/docs/resume-intel/v0.1.3/fr/changelog', section: 'resume-intel · v0.1.3', description: 'Notes de version' },
  // ── @edwinfom/resume-intel v0.1.0 ────────────────────────────────────────
  { title: 'Introduction (v0.1.0)', href: '/docs/resume-intel/v0.1.0/fr/introduction', section: 'resume-intel · v0.1.0', description: 'Version initiale' },
  { title: 'Changelog (v0.1.0)', href: '/docs/resume-intel/v0.1.0/fr/changelog', section: 'resume-intel · v0.1.0', description: 'Notes de la version initiale' },
  // ── @edwinfom/ai-guard v0.2.1 ────────────────────────────────────────────
  { title: 'Introduction', href: '/docs/ai-guard/v0.2.1/fr/introduction', section: 'ai-guard · Démarrage', description: 'Aperçu de @edwinfom/ai-guard' },
  { title: 'Installation', href: '/docs/ai-guard/v0.2.1/fr/installation', section: 'ai-guard · Démarrage', description: 'Installer avec npm, pnpm, yarn ou bun' },
  { title: 'Démarrage Rapide', href: '/docs/ai-guard/v0.2.1/fr/quick-start', section: 'ai-guard · Démarrage', description: 'Soyez opérationnel en quelques minutes' },
  { title: 'Application de Schéma', href: '/docs/ai-guard/v0.2.1/fr/schema-enforcement', section: 'ai-guard · Fonctionnalités', description: 'Pipeline de réparation JSON à 3 niveaux' },
  { title: 'Anonymisation PII', href: '/docs/ai-guard/v0.2.1/fr/pii-redaction', section: 'ai-guard · Fonctionnalités', description: 'Masquer e-mails, téléphones, cartes de crédit, etc.' },
  { title: 'Injection de Prompt', href: '/docs/ai-guard/v0.2.1/fr/prompt-injection', section: 'ai-guard · Fonctionnalités', description: 'Bloquer les attaques par injection' },
  { title: 'Jetons Canaris', href: '/docs/ai-guard/v0.2.1/fr/canary-tokens', section: 'ai-guard · Fonctionnalités', description: 'Détecter les fuites du prompt système' },
  { title: 'Politique de Contenu', href: '/docs/ai-guard/v0.2.1/fr/content-policy', section: 'ai-guard · Fonctionnalités', description: 'Détection de toxicité et de contenus nuisibles' },
  { title: "Détection d'Hallucinations", href: '/docs/ai-guard/v0.2.1/fr/hallucination-detection', section: 'ai-guard · Fonctionnalités', description: "Vérification d'ancrage RAG" },
  { title: 'Sentinelle Budgétaire', href: '/docs/ai-guard/v0.2.1/fr/budget-sentinel', section: 'ai-guard · Fonctionnalités', description: 'Comptage de tokens, limites de coûts, tarifs personnalisés' },
  { title: 'Limiteur de Débit', href: '/docs/ai-guard/v0.2.1/fr/rate-limiter', section: 'ai-guard · Fonctionnalités', description: 'Limites par utilisateur avec fenêtre glissante' },
  { title: "Journal d'Audit", href: '/docs/ai-guard/v0.2.1/fr/audit-log', section: 'ai-guard · Avancé', description: 'Callback structuré après chaque appel' },
  { title: 'Support du Streaming', href: '/docs/ai-guard/v0.2.1/fr/streaming', section: 'ai-guard · Avancé', description: 'protectStream() pour les flux asynchrones' },
  { title: 'Inspection Dry-run', href: '/docs/ai-guard/v0.2.1/fr/inspect', section: 'ai-guard · Avancé', description: 'Rapport de risque complet sans blocage' },
  { title: 'Sous-chemins Tree-Shakeable', href: '/docs/ai-guard/v0.2.1/fr/tree-shaking', section: 'ai-guard · Avancé', description: 'Importez uniquement ce dont vous avez besoin' },
  { title: 'Adaptateur Personnalisé', href: '/docs/ai-guard/v0.2.1/fr/custom-adapter', section: 'ai-guard · Avancé', description: 'Analyseur de réponse personnalisé' },
  { title: 'Vercel AI SDK', href: '/docs/ai-guard/v0.2.1/fr/vercel-adapter', section: 'ai-guard · Intégrations', description: 'Adaptateur guardVercelStream' },
  { title: 'LangChain', href: '/docs/ai-guard/v0.2.1/fr/langchain-adapter', section: 'ai-guard · Intégrations', description: 'Adaptateur createGuardedParser' },
  { title: 'Exemple Next.js', href: '/docs/ai-guard/v0.2.1/fr/nextjs-example', section: 'ai-guard · Intégrations', description: 'Exemple complet de route API' },
  { title: 'Référence API', href: '/docs/ai-guard/v0.2.1/fr/api-reference', section: 'ai-guard · Référence', description: 'API complète de la classe Guardian' },
  { title: "Types d'Erreurs", href: '/docs/ai-guard/v0.2.1/fr/error-types', section: 'ai-guard · Référence', description: 'GuardianError, InjectionError, BudgetError...' },
  { title: 'Playground Interactif', href: '/docs/ai-guard/v0.2.1/fr/playground', section: 'ai-guard · Référence', description: 'Exécutez tous les tests dans votre navigateur' },
  { title: 'Journal des Modifications', href: '/docs/ai-guard/v0.2.1/fr/changelog', section: 'ai-guard · Référence', description: 'Historique des versions — v0.2.1, v0.2.0' },
  // ── @edwinfom/ai-guard v0.2.0 ────────────────────────────────────────────
  { title: 'Introduction (v0.2.0)', href: '/docs/ai-guard/v0.2.0/fr/introduction', section: 'ai-guard · v0.2.0', description: 'Aperçu de @edwinfom/ai-guard' },
  { title: 'Journal des Modifications (v0.2.0)', href: '/docs/ai-guard/v0.2.0/fr/changelog', section: 'ai-guard · v0.2.0', description: 'Historique des versions' },
];

interface SearchModalProps {
  lang?: string;
}

export default function SearchModal({ lang = 'en' }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const searchIndex = lang === 'fr' ? SEARCH_INDEX_FR : SEARCH_INDEX_EN;
  const tSearch = lang === 'fr' ? 'Rechercher...' : 'Search documentation...';
  const tNoResults = lang === 'fr' ? 'Aucun résultat pour' : 'No results for';
  const tRecent = lang === 'fr' ? 'Récents' : 'Recent';
  const tNavigate = lang === 'fr' ? 'Naviguer' : 'Navigate';
  const tSelect = lang === 'fr' ? 'Sélectionner' : 'Select';
  const tClose = lang === 'fr' ? 'Fermer' : 'Close';

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }
    const q = query.toLowerCase();
    const filtered = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    ).slice(0, 8);
    setResults(filtered);
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      window.location.href = results[activeIndex].href;
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
        id="search-btn"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span className="search-trigger-text">{tSearch}</span>
        <kbd className="search-kbd">⌘K</kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="search-backdrop" onClick={() => setOpen(false)} aria-hidden />

      {/* Modal */}
      <div className="search-modal" role="dialog" aria-modal aria-label="Search">
        <div className="search-input-wrap">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="search-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder={tSearch}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <button className="search-close-btn" onClick={() => setOpen(false)}>
            <kbd>Esc</kbd>
          </button>
        </div>

        {query && results.length === 0 && (
          <div className="search-empty">
            <span>{tNoResults} &ldquo;<strong>{query}</strong>&rdquo;</span>
          </div>
        )}

        {results.length > 0 && (
          <ul className="search-results" ref={listRef} role="listbox">
            {results.map((result, i) => (
              <li key={result.href} role="option" aria-selected={i === activeIndex}>
                <a
                  href={result.href}
                  className={`search-result-item${i === activeIndex ? ' active' : ''}`}
                  onClick={() => setOpen(false)}
                  onMouseEnter={() => setActiveIndex(i)}
                >
                  <div className="search-result-content">
                    <span className="search-result-section">{result.section}</span>
                    <span className="search-result-title">{result.title}</span>
                    {result.description && (
                      <span className="search-result-desc">{result.description}</span>
                    )}
                  </div>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="search-result-arrow">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}

        {!query && (
          <div className="search-hints">
            <div className="search-hint-group">
              <span className="search-hint-label">{tRecent}</span>
              <a href={`/docs/resume-intel/v0.2.1/${lang}/introduction`} className="search-hint-link" onClick={() => setOpen(false)}>
                Introduction — @edwinfom/resume-intel v0.2.1
              </a>
              <a href={`/docs/ai-guard/v0.2.1/${lang}/introduction`} className="search-hint-link" onClick={() => setOpen(false)}>
                Introduction — @edwinfom/ai-guard v0.2.1
              </a>
            </div>
          </div>
        )}

        <div className="search-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> {tNavigate}</span>
          <span><kbd>↵</kbd> {tSelect}</span>
          <span><kbd>Esc</kbd> {tClose}</span>
        </div>
      </div>
    </>
  );
}
