import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
	initial: { opacity: 0, y: 12 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
	},
	exit: { opacity: 0, y: -12, transition: { duration: 0.25 } }
};

const PageTransition = ({ children }) => {
	return (
		<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
			{children}
		</motion.div>
	);
};

export default PageTransition;


