"use client";

import { motion } from "framer-motion";

export const slideUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6
        }
    }
};

export const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4
        }
    }
};

export default function ScrollReveal({ children, variant = "slideUp", delay = 0, className = "" }) {
    const getVariants = () => {
        switch (variant) {
            case "fadeIn": return fadeIn;
            case "scaleUp": return scaleUp;
            default: return slideUp;
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={getVariants()}
            transition={{ delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
