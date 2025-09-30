import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import React, { useEffect, useState } from "react";
import img1 from "/src/assets/landing/1.png";
import img2 from "/src/assets/landing/2.png";
import img3 from "/src/assets/landing/3.png";
import img4 from "/src/assets/landing/4.png";
import img5 from "/src/assets/landing/5.png";
import img6 from "/src/assets/landing/6.png";
import img7 from "/src/assets/landing/7.png";
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
      img: img1,
    },
    {
      id: 2,
      z: 3,
      img: img2,
    },
    {
      id: 3,
      z: 2,
      img: img3,
    },
    {
      id: 4,
      z: 2,
      img: img4,
    },
    {
      id: 5,
      z: 2,
      img: img5,
    },
    {
      id: 6,
      z: 2,
      img: img6,
    },
    {
      id: 7,
      z: 2,
      img: img7,
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
