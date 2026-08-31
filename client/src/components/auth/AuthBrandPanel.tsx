// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';

export const AuthBrandPanel = () => {
  return (
    <div className="cc-auth-art">
      <div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cc-visual"><div className="cc-visual-glow" /><div className="cc-core"><span className="cc-ring"/><span className="cc-ring"/><span className="cc-ring"/><span className="cc-center-core"/></div></div>
          <h2 className="cc-serif text-5xl tracking-tight">Build stronger<br/>capabilities.</h2><p>Intelligence for the people and skills that power your organization.</p>
        </motion.div>
      </div>
    </div>
  );
};
