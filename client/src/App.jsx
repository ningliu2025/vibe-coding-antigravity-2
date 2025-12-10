import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Search, RefreshCw, Wand2 } from 'lucide-react';
import NameCard from './components/NameCard';
import HarmonyMeter from './components/HarmonyMeter';

function App() {
    const [activeTab, setActiveTab] = useState('generator');
    const [generatorType, setGeneratorType] = useState('english'); // 'english' or 'chinese'
    const [names, setNames] = useState([]);
    const [filters, setFilters] = useState({ gender: '', origin: '', search: '' });
    const [matchInput, setMatchInput] = useState({ name1: '', name2: '' });
    const [matchResult, setMatchResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch names
    useEffect(() => {
        fetchNames();
    }, [filters]);

    const fetchNames = async () => {
        const params = new URLSearchParams();
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.origin) params.append('origin', filters.origin);
        if (filters.search) params.append('search', filters.search);

        // If in Chinese mode, we might want to filter by origin 'Chinese' automatically or handle it in UI
        // For now, let's fetch all and filter client side or let the user filter.
        // Actually, let's pass the type to the backend or filter here.
        // Let's filter client-side for simplicity since we have all names.

        try {
            const res = await fetch(`http://localhost:3000/api/names?${params}`);
            const data = await res.json();

            // Client-side filtering for the section
            const filtered = data.filter(n => {
                if (generatorType === 'chinese') return n.origin === 'Chinese';
                return n.origin !== 'Chinese';
            });

            setNames(filtered);
        } catch (err) {
            console.error("Failed to fetch names", err);
        }
    };

    // Refetch when generator type changes
    useEffect(() => {
        fetchNames();
    }, [generatorType]);

    const handleMatch = async (e) => {
        e.preventDefault();
        if (!matchInput.name1 || !matchInput.name2) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(matchInput)
            });
            const data = await res.json();
            setMatchResult(data);
        } catch (err) {
            console.error("Failed to match", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header style={{ textAlign: 'center', padding: '4rem 0 2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #ffd700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Name Harmony
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                        Discover the perfect name or find your cosmic connection.
                    </p>
                </motion.div>
            </header>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <button
                    className={`glass-panel ${activeTab === 'generator' ? 'active' : ''}`}
                    onClick={() => setActiveTab('generator')}
                    style={{
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: activeTab === 'generator' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: activeTab === 'generator' ? 'var(--color-primary)' : 'var(--color-text)'
                    }}
                >
                    <Sparkles size={18} /> Name Generator
                </button>
                <button
                    className={`glass-panel ${activeTab === 'match' ? 'active' : ''}`}
                    onClick={() => setActiveTab('match')}
                    style={{
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: activeTab === 'match' ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: activeTab === 'match' ? 'var(--color-secondary)' : 'var(--color-text)'
                    }}
                >
                    <Heart size={18} /> Compatibility Match
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'generator' ? (
                    <motion.div
                        key="generator"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Sub-tabs for English / Chinese */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                            <button
                                onClick={() => setGeneratorType('english')}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '20px',
                                    background: generatorType === 'english' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                    color: generatorType === 'english' ? '#000' : '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                English Names
                            </button>
                            <button
                                onClick={() => setGeneratorType('chinese')}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '20px',
                                    background: generatorType === 'chinese' ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                    color: generatorType === 'chinese' ? '#000' : '#fff',
                                    fontWeight: '600'
                                }}
                            >
                                Chinese Names
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Search names..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: '#fff'
                                    }}
                                />
                            </div>

                            <select
                                value={filters.gender}
                                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--glass-border)' }}
                            >
                                <option value="">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            <select
                                value={filters.origin}
                                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: '#fff', border: '1px solid var(--glass-border)' }}
                            >
                                <option value="">All Origins</option>
                                <option value="Latin">Latin</option>
                                <option value="Greek">Greek</option>
                                <option value="Hebrew">Hebrew</option>
                                <option value="German">German</option>
                                <option value="French">French</option>
                                <option value="English">English</option>
                                <option value="Irish">Irish</option>
                            </select>
                        </div>

                        {/* Results Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {names.map(name => (
                                <NameCard key={name.id} {...name} />
                            ))}
                        </div>
                        {names.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                                No names found matching your criteria.
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="match"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ maxWidth: '600px', margin: '0 auto' }}
                    >
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Check Compatibility</h2>
                            <form onSubmit={handleMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>First Name</label>
                                    <input
                                        type="text"
                                        value={matchInput.name1}
                                        onChange={(e) => setMatchInput({ ...matchInput, name1: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1.1rem' }}
                                        placeholder="e.g. Romeo"
                                    />
                                </div>

                                <div style={{ textAlign: 'center', color: 'var(--color-secondary)' }}>
                                    <Heart size={24} fill="currentColor" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Second Name</label>
                                    <input
                                        type="text"
                                        value={matchInput.name2}
                                        onChange={(e) => setMatchInput({ ...matchInput, name2: e.target.value })}
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1.1rem' }}
                                        placeholder="e.g. Juliet"
                                    />
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    {loading ? <RefreshCw className="animate-spin" /> : <Wand2 size={20} />}
                                    Calculate Harmony
                                </button>
                            </form>
                        </div>

                        {matchResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring" }}
                            >
                                <HarmonyMeter score={matchResult.score} details={matchResult.details} />
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
