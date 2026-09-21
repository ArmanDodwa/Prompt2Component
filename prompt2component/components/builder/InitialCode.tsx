export const INITIAL_CODE = `import React, { useState } from 'react';

export default function WelcomeCard() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(function() {
      setIsGenerating(false);
      alert('Generating component for: ' + prompt);
    }, 1500);
  };

  const features = [
    {
      title: "Lightning Fast",
      description: "Convert natural language descriptions into production-ready React and Tailwind code instantly.",
      icon: "⚡"
    },
    {
      title: "Fully Responsive",
      description: "Every generated component is mobile-friendly and adapts seamlessly across all screen sizes.",
      icon: "📱"
    },
    {
      title: "Customizable UI",
      description: "Easily tweak colors, layout, and components using standard Tailwind utility classes.",
      icon: "🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-neutral-800/60">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
            P
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Prompt2Component
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm text-neutral-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
          <a href="#examples" className="hover:text-white transition-colors">Examples</a>
        </nav>
        <button className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/60 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
          <span>✨ Powered by Advanced AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Turn your ideas into <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">beautiful UI code</span>.
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-xl mb-10">
          Prompt2Component bridges the gap between design and development. Enter a prompt below to instantly generate your layout.
        </p>

        {/* Prompt Input Form */}
        <form onSubmit={handleGenerate} className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-3 mb-16">
          <input
            type="text"
            value={prompt}
            onChange={function(e) { setPrompt(e.target.value); }}
            placeholder="e.g., A modern pricing table with three tiers..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-neutral-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all disabled:opacity-50 text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <span>Generating...</span>
            ) : (
              <>
                <span>Generate</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {features.map(function(feature, idx) {
            return (
              <div key={idx} className="bg-neutral-900/50 border border-neutral-800/80 rounded-2xl p-6 hover:border-neutral-700 transition-all group">
                <div className="text-3xl mb-4 p-3 bg-neutral-900 rounded-xl w-fit border border-neutral-800 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} Prompt2Component. All rights reserved.</p>
      </footer>
    </div>
  );
}`;