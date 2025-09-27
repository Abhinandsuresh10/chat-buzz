import type { Variants } from "framer-motion";



export const containerVariant: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            when: 'beforeChildren',
            staggerChildren: 0.3
        }
      }
}

export const slideUpVariant: Variants = {
    hidden: {
        opacity: 0,
        y: 50
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 50,
            stiffness: 100
        }
    }
}

export const scaleVariant: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            damping: 15,
            stiffness: 100
        }
    }
}