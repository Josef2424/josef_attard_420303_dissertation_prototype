import { useEffect, useState } from "react";
import "./newsSection.css";

function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(2);

  const viewMoreNews = () => {
    // Increment the number of displayed news items by 2
    setDisplayCount((prev) => prev + 2);

    // Scroll to the bottom of the news section
    const newsSection = document.getElementById("news-section");
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/latest?apikey=pub_68029481065a8e7021e65daac52f5161815ad&country=mt&language=en,mt`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data.results || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Could not load news at this time");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading)
    return (
      <section id="news-section">
        <h2>News</h2>
        <div id="news-container">
          <p>Loading news...</p>
        </div>
      </section>
    );

  if (error)
    return (
      <section id="news-section">
        <h2>News</h2>
        <div id="news-container">
          <p>{error}</p>
        </div>
      </section>
    );

  return (
    <section id="news-section">
      <h2>News</h2>
      <div id="news-container">
        {news.slice(0, displayCount).map((item, index) => (
          <div key={index} className="news-item">
            <h3>{item.title}</h3>
            <p>{item.description || "No description available"}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
      {displayCount < news.length && (
        <div id="viewMore-btn-container">
          <button
            type="button"
            className="btn"
            id="viewMore_btn"
            onClick={viewMoreNews}
          >
            View more
          </button>
        </div>
      )}
    </section>
  );
}

export default NewsSection;
