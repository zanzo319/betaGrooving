import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async"; // Importa Helmet per i meta tag dinamici
import { motion } from "framer-motion";
import "../styles/Merch.css";

const Merch = () => {
  const phoneNumber = "1234567890"; // Aggiungi Numero WhatsApp Grooving
  const productsRef = useRef(null);

  // Dati prodotti
  const merchData = {
    Tanktop: [
      { id: 1, name: "GROOVING Men's Tanktop", image: "./images/merch/tanktop/tank1.png" },
      { id: 2, name: "GROOVING Women's Tanktop", image: "./images/merch/tanktop/tank2.png" }
    ],
    Shopper: [
      {
        id: 3,
        name: "GROOVING Shopper",
        images: ["./images/merch/shopper/shopper1.png", "./images/merch/shopper/shopper2.png", "./images/merch/shopper/shopper3.png"]
      }
    ],
    Hats: [
      {
        id: 4,
        name: "GROOVING Hat", images: ["./images/merch/hats/hat1.png", "./images/merch/hats/hat2.png"]
      }
    ]
  };

  // Funzione per scorrere ai prodotti
  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Gestione slider per Shopper e Hats
  const [imageIndexes, setImageIndexes] = useState({ Shopper: 0, Hats: 0 });

  const nextImage = (category) => {
    setImageIndexes((prev) => ({
      ...prev,
      [category]: (prev[category] + 1) % merchData[category][0].images.length
    }));
  };

  const prevImage = (category) => {
    setImageIndexes((prev) => ({
      ...prev,
      [category]: (prev[category] - 1 + merchData[category][0].images.length) % merchData[category][0].images.length
    }));
  };

  // Funzione per generare il link WhatsApp
  const generateWhatsAppLink = (productName) => {
    const message = encodeURIComponent(`Hi, I'm interested in purchasing the ${productName} from Grooving!`);
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  // Lazy loading delle immagini
  const LazyLoadImage = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} loading="lazy" />
  );

  return (
    <motion.div className="merch-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {/* Meta tag per la pagina Merch */}
      <Helmet>
        <title>Grooving Merchandise - Style and Sound</title>
        <meta
          name="description"
          content="Explore Grooving's unique merchandise collection. From stylish tank tops to hats and shoppers, carry the Grooving vibe with you everywhere."
        />
        <meta
          name="keywords"
          content="Grooving merchandise, tank tops, hats, shoppers, music merchandise, Grooving shop"
        />
        <meta name="author" content="Grooving Team" />
        <meta property="og:title" content="Grooving Merchandise - Style and Sound" />
        <meta
          property="og:description"
          content="Discover Grooving's exclusive merch collection. Get your stylish tank tops, shoppers, and hats today!"
        />
        <meta property="og:image" content="/images/og-merch.png" />
        <meta property="og:url" content="http://yourdomain.com/merch" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <motion.h1 className="logo" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
        GET INTO THE GROOVE
      </motion.h1>

      <motion.p className="motto" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}>
        Style and Sound.<br/>
        Our merchandise is more than a look, it's a way of living music.<br/>
        Get yours now and carry Grooving with you everywhere.<br/>
      </motion.p>

      <motion.button 
        className="explore-button" 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.2, delay: 1 }}
        onClick={scrollToProducts}
      >
        LET'S GROOVE!
      </motion.button>

      <div ref={productsRef}>
        {Object.keys(merchData).map((category) => (
          <div key={category}>
            <h2 className="category-title">{category}</h2>

            {/* Controllo per Tanktop */}
            {category === "Tanktop" ? (
              <div className="product-container">
                {merchData[category].map((product) => (
                  <div key={product.id} className="merch-item">
                    <LazyLoadImage src={product.image} alt={product.name} className="merch-image" />
                    <h3 className="merch-name">{product.name}</h3>
                    <a href={generateWhatsAppLink(product.name)} target="_blank" rel="noopener noreferrer">
                      <button className="order-button">Order Now</button>
                    </a>
                  </div>
                ))}
              </div>
            ) : category === "Shopper" ? (
              <div className="shopper-container">
                <div className="shopper-info">
                  <h3 className="merch-name">{merchData[category][0].name}</h3>
                  <a href={generateWhatsAppLink(merchData[category][0].name)} target="_blank" rel="noopener noreferrer">
                    <button className="order-button">Order Now</button>
                  </a>
                </div>
                <div className="shopper-container">
                  <button className="shophat-arrow left" onClick={() => prevImage("Shopper")}>&#10094;</button>
                  <LazyLoadImage src={merchData[category][0].images[imageIndexes["Shopper"]]} alt="Shopper" className="shopper-image" />
                  <button className="shophat-arrow right" onClick={() => nextImage("Shopper")}>&#10095;</button>
                </div>
              </div>
            ) : (
              <div className="shophat-container">
                <div className="hats-container">
                  <button className="shophat-arrow left" onClick={() => prevImage("Hats")}>&#10094;</button>
                  <LazyLoadImage src={merchData[category][0].images[imageIndexes["Hats"]]} alt={merchData[category][0].name} className="hats-image" />
                  <button className="shophat-arrow right" onClick={() => nextImage("Hats")}>&#10095;</button>
                </div>
                <div className="hats-info">
                  <h3 className="merch-name">{merchData[category][0].name}</h3>
                  <a href={generateWhatsAppLink(merchData[category][0].name)} target="_blank" rel="noopener noreferrer">
                    <button className="order-button">Order Now</button>
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Merch;