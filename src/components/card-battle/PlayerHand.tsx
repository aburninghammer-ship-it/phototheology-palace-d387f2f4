import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  playerName: string;
  cardsInHand: string[];
  cardsPlayed: string[];
  score: number;
  isOpponent?: boolean;
}

export function PlayerHand({ playerName, cardsInHand, cardsPlayed, score, isOpponent = false }: Props) {
  const allCards = [...cardsInHand, ...cardsPlayed];
  const maxCards = 6;
  
  return (
    <div className={`bg-gradient-to-br ${isOpponent ? 'from-purple-900/40 to-indigo-900/40' : 'from-red-900/40 to-orange-900/40'} backdrop-blur-xl border ${isOpponent ? 'border-purple-400/30' : 'border-red-400/30'} rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{playerName}</h3>
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
          <Trophy className="h-4 w-4 mr-1" />
          {score}
        </Badge>
      </div>
      
      <div className="flex gap-3 justify-center">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: maxCards }).map((_, index) => {
            const cardCode = allCards[index];
            const isPlayed = cardCode && cardsPlayed.includes(cardCode);
            const isEmpty = !cardCode;
            
            return (
              <motion.div
                key={`${playerName}-card-${index}`}
                layout
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ 
                  scale: isEmpty ? 0 : 1, 
                  rotateY: 0,
                  opacity: isEmpty ? 0 : 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`relative w-16 h-24 rounded-lg ${
                    isPlayed 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-[0_0_25px_rgba(34,197,94,0.6)]' 
                      : 'bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 shadow-lg'
                  } border-2 ${
                    isPlayed ? 'border-green-300' : 'border-white/30'
                  } backdrop-blur-sm flex items-center justify-center transition-all duration-300`}
                  animate={isPlayed ? {
                    boxShadow: [
                      '0 0 25px rgba(34,197,94,0.6)',
                      '0 0 40px rgba(34,197,94,0.9)',
                      '0 0 25px rgba(34,197,94,0.6)',
                    ]
                  } : {}}
                  transition={isPlayed ? {
                    duration: 1.5,
                    repeat: Infinity,
                  } : {}}
                >
                  {/* Card pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
                  
                  {/* Card glow effect when played */}
                  {isPlayed && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-green-400/50 to-emerald-600/50 rounded-lg"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  
                  {/* Card code display */}
                  {cardCode && (
                    <span className={`relative z-10 text-xs font-bold ${
                      isPlayed ? 'text-white' : 'text-white/90'
                    } text-center px-1`}>
                      {cardCode}
                    </span>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="mt-3 text-center text-sm text-purple-200">
        {cardsInHand.length} {cardsInHand.length === 1 ? 'card' : 'cards'} remaining
      </div>
    </div>
  );
}
