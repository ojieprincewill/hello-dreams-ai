import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const AnimatedMessage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default AnimatedMessage;
