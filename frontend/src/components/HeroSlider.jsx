import { useState, useEffect } from 'react';

const banners = [
  { id: 1, src: "https://i.imgur.com/qzHgAHF.png", alt: "Promo 1" },
  { id: 2, src: "https://i.imgur.com/egBsE7Q.jpeg", alt: "Promo 2" },
  { id: 3, src: "https://i.imgur.com/CjuFSPj.png", alt: "Promo 3" },
  { id: 4, src: "https://i.imgur.com/rrF2rMk.jpeg", alt: "Promo 4" }
];

function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay: Cambia cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  return (
    <div className="slider-container">
      <div 
        className="slider-wrapper" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner) => (
          <div key={banner.id} className="slide">
            <img src={banner.src} alt={banner.alt} />
          </div>
        ))}
      </div>

      <button className="slider-btn prev-btn" onClick={prevSlide}>&#10094;</button>
      <button className="slider-btn next-btn" onClick={nextSlide}>&#10095;</button>

      <div className="dots-container">
        {banners.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;