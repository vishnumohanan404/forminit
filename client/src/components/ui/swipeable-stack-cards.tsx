import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import React, { useEffect, useState } from "react";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  isLoaded: boolean;
}

function CardRotate({ children, onSendToBack, isLoaded }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleDragEnd(_: any, info: PanInfo) {
    const threshold = 180;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute h-96 w-96 cursor-grab"
      style={{ x, y, rotateX: isLoaded ? rotateX : 0, rotateY: isLoaded ? rotateY : 0 }}
      drag={isLoaded}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function SwipeableStackCards() {
  const initialCards = [
    {
      id: 1,
      z: 4,
      img: "https://i.pinimg.com/736x/d7/bd/94/d7bd94a0231456ac7f6885de1eccd943.jpg",
    },
    {
      id: 2,
      z: 3,
      img: "https://i.pinimg.com/236x/fd/5d/14/fd5d146cf06e32d30139e4e3f37c993c.jpg",
    },
    {
      id: 3,
      z: 2,
      img: "https://i.pinimg.com/564x/c6/f8/e9/c6f8e988912e469686c431cc680ef49e.jpg",
    },
  ];
  const [cards, setCards] = useState(initialCards);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger the loading animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Small delay to ensure smooth animation start

    return () => clearTimeout(timer);
  }, []);

  const sendToBack = (id: number) => {
    setCards(prev => {
      const newCards = [...prev];
      const index = newCards.findIndex(card => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  return (
    <div
      className="relative h-96 w-96"
      style={{ perspective: 600 }}
    >
      {cards.map((card, index) => {
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            isLoaded={isLoaded}
          >
            <motion.div
              className="h-full w-full rounded-lg"
              animate={{
                rotateZ: (cards.length - index - 1) * 8,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={{
                rotateZ: 0,
                scale: 1,
                transformOrigin: "90% 90%",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.1 }}
            >
              <img
                src={card.img}
                alt="card"
                className="pointer-events-none h-full w-full rounded-lg object-cover"
              />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
