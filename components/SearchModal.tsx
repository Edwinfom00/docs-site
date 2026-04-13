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
  // v0.2.1
  { title: 'Introduction', href: '/docs/ai-guard/v0.2.1/en/introduction', section: 'Getting Started', description: 'Overview of @edwinfom/ai-guard' },
  { title: 'Installation', href: '/docs/ai-guard/v0.2.1/en/installation', section: 'Getting Started', description: 'Install with npm, pnpm, yarn or bun' },
  { title: 'Quick Start', href: '/docs/ai-guard/v0.2.1/en/quick-start', section: 'Getting Started', description: 'Get up and running in minutes' },
  { title: 'Schema Enforcement', href: '/docs/ai-guard/v0.2.1/en/schema-enforcement', section: 'Core Features', description: '3-level JSON repair pipeline' },
  { title: 'PII Redaction', href: '/docs/ai-guard/v0.2.1/en/pii-redaction', section: 'Core Features', description: 'Scrub emails, phones, credit cards and more' },
  { title: 'Prompt Injection', href: '/docs/ai-guard/v0.2.1/en/prompt-injection', section: 'Core Features', description: 'Block injection attacks' },
  { title: 'Canary Tokens', href: '/docs/ai-guard/v0.2.1/en/canary-tokens', section: 'Core Features', description: 'Detect system prompt leakage' },
  { title: 'Content Policy', href: '/docs/ai-guard/v0.2.1/en/content-policy', section: 'Core Features', description: 'Toxicity and harmful content detection' },
  { title: 'Hallucination Detection', href: '/docs/ai-guard/v0.2.1/en/hallucination-detection', section: 'Core Features', description: 'RAG grounding check' },
  { title: 'Budget Sentinel', href: '/docs/ai-guard/v0.2.1/en/budget-sentinel', section: 'Core Features', description: 'Token counting, cost limits, custom model pricing' },
  { title: 'Rate Limiter', href: '/docs/ai-guard/v0.2.1/en/rate-limiter', section: 'Core Features', description: 'Per-user sliding-window limits' },
  { title: 'Audit Log', href: '/docs/ai-guard/v0.2.1/en/audit-log', section: 'Advanced', description: 'Structured callback after every call' },
  { title: 'Streaming Support', href: '/docs/ai-guard/v0.2.1/en/streaming', section: 'Advanced', description: 'protectStream() for async streams' },
  { title: 'Dry-run Inspect', href: '/docs/ai-guard/v0.2.1/en/inspect', section: 'Advanced', description: 'Full risk report without blocking' },
  { title: 'Tree-Shakeable Sub-paths', href: '/docs/ai-guard/v0.2.1/en/tree-shaking', section: 'Advanced', description: 'Import only what you need' },
  { title: 'Custom Adapter', href: '/docs/ai-guard/v0.2.1/en/custom-adapter', section: 'Advanced', description: 'Custom response parser' },
  { title: 'Vercel AI SDK', href: '/docs/ai-guard/v0.2.1/en/vercel-adapter', section: 'Integrations', description: 'guardVercelStream adapter' },
  { title: 'LangChain', href: '/docs/ai-guard/v0.2.1/en/langchain-adapter', section: 'Integrations', description: 'createGuardedParser adapter' },
  { title: 'Next.js Example', href: '/docs/ai-guard/v0.2.1/en/nextjs-example', section: 'Integrations', description: 'Complete API route example' },
  { title: 'API Reference', href: '/docs/ai-guard/v0.2.1/en/api-reference', section: 'Reference', description: 'Full Guardian class API' },
  { title: 'Error Types', href: '/docs/ai-guard/v0.2.1/en/error-types', section: 'Reference', description: 'GuardianError, InjectionError, BudgetError...' },
  { title: 'Playground', href: '/docs/ai-guard/v0.2.1/en/playground', section: 'Reference', description: 'Run all standalone tests in your browser' },
  { title: 'Changelog', href: '/docs/ai-guard/v0.2.1/en/changelog', section: 'Reference', description: 'Release history — v0.2.1, v0.2.0, v0.1.0' },
  // v0.2.0
  { title: 'Introduction (v0.2.0)', href: '/docs/ai-guard/v0.2.0/en/introduction', section: 'v0.2.0', description: 'Overview of @edwinfom/ai-guard' },
  { title: 'Budget Sentinel (v0.2.0)', href: '/docs/ai-guard/v0.2.0/en/budget-sentinel', section: 'v0.2.0', description: 'Token counting and cost limits' },
  { title: 'Changelog (v0.2.0)', href: '/docs/ai-guard/v0.2.0/en/changelog', section: 'v0.2.0', description: 'Release history' },
];

const SEARCH_INDEX_FR: SearchResult[] = [
  // v0.2.1
  { title: 'Introduction', href: '/docs/ai-guard/v0.2.1/fr/introduction', section: 'Démarrage', description: 'Aperçu de @edwinfom/ai-guard' },
  { title: 'Installation', href: '/docs/ai-guard/v0.2.1/fr/installation', section: 'Démarrage', description: 'Installer avec npm, pnpm, yarn ou bun' },
  { title: 'Démarrage Rapide', href: '/docs/ai-guard/v0.2.1/fr/quick-start', section: 'Démarrage', description: 'Soyez opérationnel en quelques minutes' },
  { title: 'Application de Schéma', href: '/docs/ai-guard/v0.2.1/fr/schema-enforcement', section: 'Fonctionnalités Principales', description: 'Pipeline de réparation JSON à 3 niveaux' },
  { title: 'Anonymisation PII', href: '/docs/ai-guard/v0.2.1/fr/pii-redaction', section: 'Fonctionnalités Principales', description: 'Masquer e-mails, téléphones, cartes de crédit, etc.' },
  { title: 'Injection de Prompt', href: '/docs/ai-guard/v0.2.1/fr/prompt-injection', section: 'Fonctionnalités Principales', description: 'Bloquer les attaques par injection' },
  { title: 'Jetons Canaris', href: '/docs/ai-guard/v0.2.1/fr/canary-tokens', section: 'Fonctionnalités Principales', description: 'Détecter les fuites du prompt système' },
  { title: 'Politique de Contenu', href: '/docs/ai-guard/v0.2.1/fr/content-policy', section: 'Fonctionnalités Principales', description: 'Détection de toxicité et de contenus nuisibles' },
  { title: "Détection d'Hallucinations", href: '/docs/ai-guard/v0.2.1/fr/hallucination-detection', section: 'Fonctionnalités Principales', description: "Vérification d'ancrage RAG" },
  { title: 'Sentinelle Budgétaire', href: '/docs/ai-guard/v0.2.1/fr/budget-sentinel', section: 'Fonctionnalités Principales', description: 'Comptage de tokens, limites de coûts, tarifs personnalisés' },
  { title: 'Limiteur de Débit', href: '/docs/ai-guard/v0.2.1/fr/rate-limiter', section: 'Fonctionnalités Principales', description: 'Limites par utilisateur avec fenêtre glissante' },
  { title: "Journal d'Audit", href: '/docs/ai-guard/v0.2.1/fr/audit-log', section: 'Avancé', description: 'Callback structuré après chaque appel' },
  { title: 'Support du Streaming', href: '/docs/ai-guard/v0.2.1/fr/streaming', section: 'Avancé', description: 'protectStream() pour les flux asynchrones' },
  { title: 'Inspection Dry-run', href: '/docs/ai-guard/v0.2.1/fr/inspect', section: 'Avancé', description: 'Rapport de risque complet sans blocage' },
  { title: 'Sous-chemins Tree-Shakeable', href: '/docs/ai-guard/v0.2.1/fr/tree-shaking', section: 'Avancé', description: 'Importez uniquement ce dont vous avez besoin' },
  { title: 'Adaptateur Personnalisé', href: '/docs/ai-guard/v0.2.1/fr/custom-adapter', section: 'Avancé', description: 'Analyseur de réponse personnalisé' },
  { title: 'Vercel AI SDK', href: '/docs/ai-guard/v0.2.1/fr/vercel-adapter', section: 'Intégrations', description: 'Adaptateur guardVercelStream' },
  { title: 'LangChain', href: '/docs/ai-guard/v0.2.1/fr/langchain-adapter', section: 'Intégrations', description: 'Adaptateur createGuardedParser' },
  { title: 'Exemple Next.js', href: '/docs/ai-guard/v0.2.1/fr/nextjs-example', section: 'Intégrations', description: 'Exemple complet de route API' },
  { title: 'Référence API', href: '/docs/ai-guard/v0.2.1/fr/api-reference', section: 'Référence', description: 'API complète de la classe Guardian' },
  { title: "Types d'Erreurs", href: '/docs/ai-guard/v0.2.1/fr/error-types', section: 'Référence', description: 'GuardianError, InjectionError, BudgetError...' },
  { title: 'Playground Interactif', href: '/docs/ai-guard/v0.2.1/fr/playground', section: 'Référence', description: 'Exécutez tous les tests dans votre navigateur' },
  { title: 'Journal des Modifications', href: '/docs/ai-guard/v0.2.1/fr/changelog', section: 'Référence', description: 'Historique des versions — v0.2.1, v0.2.0, v0.1.0' },
  // v0.2.0
  { title: 'Introduction (v0.2.0)', href: '/docs/ai-guard/v0.2.0/fr/introduction', section: 'v0.2.0', description: 'Aperçu de @edwinfom/ai-guard' },
  { title: 'Journal des Modifications (v0.2.0)', href: '/docs/ai-guard/v0.2.0/fr/changelog', section: 'v0.2.0', description: 'Historique des versions' },
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
