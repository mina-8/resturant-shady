import React from "react";
import logo from "@/../../public/logo.png";
import { motion } from "framer-motion";

interface LoadingProps {
  loading: boolean; // true = عرض الشعار، false = بدء الانقسام
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* الشعار أثناء التحميل */}
      {loading && (
        <div className="flex justify-center items-center h-screen bg-white">
          <img
            src={logo}
            alt="BSCO"
            className="h-20 w-auto animate-pulse drop-shadow-lg"
          />
        </div>
      )}

      {/* عند انتهاء التحميل نبدأ الانقسام */}
      {!loading && (
        <>
          {/* النصف العلوي */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="fixed top-0 left-0 w-full h-1/2 bg-white shadow-md"
          />

          {/* النصف السفلي */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="fixed bottom-0 left-0 w-full h-1/2 bg-white shadow-md"
          />
        </>
      )}
    </div>
  );
};

export default Loading;
