import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import palaceImage from "@/assets/palace-card-back.jpg";

interface PrincipleCard {
  code: string;
  name: string;
  question: string;
  floor: number;
  floorColor: string;
}

interface Props {
  card: PrincipleCard | null;
  isDrawing: boolean;
  onCardClick?: () => void;
}

export function CardDrawAnimation({ card, isDrawing, onCardClick }: Props) {
  return (
    <div className="relative flex items-center justify-center min-h-[400px]">
      <AnimatePresence mode="wait">
        {isDrawing && (
          <motion.div
            key="drawing"
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1,
              rotateY: 0,
              transition: {
                duration: 0.6,
                times: [0, 0.6, 1],
                ease: "easeOut"
              }
            }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            className="absolute"
          >
            <Card className="w-[320px] h-[440px] border-4 border-primary/40 bg-gradient-to-br from-primary/20 to-background">
              <CardContent className="p-0 h-full flex items-center justify-center relative overflow-hidden">
                <img 
                  src={palaceImage} 
                  alt="Card Back" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="relative z-10"
                >
                  <Sparkles className="h-24 w-24 text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.8)]" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!isDrawing && card && (
          <motion.div
            key={`card-${card.code}`}
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              rotateY: 0,
              transition: {
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }
            }}
            whileHover={{ 
              scale: 1.05,
              rotate: [0, -2, 2, 0],
              transition: { rotate: { duration: 0.3 } }
            }}
            onClick={onCardClick}
            className="cursor-pointer"
          >
            <Card className={`
              w-[320px] h-[440px] border-4
              bg-gradient-to-br ${card.floorColor}
              shadow-2xl hover:shadow-[0_0_60px_rgba(var(--primary),0.6)]
              transition-shadow duration-300
            `}>
              <CardContent className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-tr-[80px] blur-xl" />
                
                <div className="relative z-10 space-y-4">
                  {/* Card Header */}
                  <div className="space-y-2">
                    <Badge className="bg-white/20 text-white border-white/40 text-xs backdrop-blur-sm">
                      Floor {card.floor}
                    </Badge>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="text-4xl font-black text-white drop-shadow-lg tracking-tight">
                        {card.code}
                      </div>
                      <div className="text-lg font-semibold text-white/90 mt-1">
                        {card.name}
                      </div>
                    </motion.div>
                  </div>

                  {/* Card Question */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/15 backdrop-blur-md rounded-lg p-4 border border-white/30 mt-auto"
                  >
                    <p className="text-white/95 text-sm leading-relaxed font-medium">
                      {card.question}
                    </p>
                  </motion.div>
                </div>

                {/* Sparkle effect on reveal */}
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ 
                    opacity: 0, 
                    scale: 2,
                  }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Sparkles className="h-32 w-32 text-white/80" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card shadow/platform */}
      {(isDrawing || card) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          className="absolute bottom-0 w-[300px] h-8 bg-primary rounded-full blur-2xl"
        />
      )}
    </div>
  );
}
