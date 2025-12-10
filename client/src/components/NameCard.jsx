import React from 'react';
import { motion } from 'framer-motion';

const NameCard = ({ name, gender, origin, meaning }) => {
    return (
        <motion.div
            className="glass-panel"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
            style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                borderLeft: `4px solid ${gender === 'female' ? 'var(--color-secondary)' : 'var(--color-accent)'}`
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{name}</h3>
                <span style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    opacity: 0.7
                }}>{origin}</span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>"{meaning}"</p>
        </motion.div>
    );
};

export default NameCard;
