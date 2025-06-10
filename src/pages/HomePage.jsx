// src/pages/HomePage.jsx

import React, { useEffect, useState, useRef } from "react";
import "./HomePage.css";
import logo from "../assets/lunchbylaa_logo.png";
import { useNavigate } from "react-router-dom";
import MenuSection from "../components/MenuSection";
import { BiArrowToLeft } from "react-icons/bi";
import { BsArrowLeft, BsArrowLeftCircle } from "react-icons/bs";
import { CgArrowLeft } from "react-icons/cg";
import { FaArrowLeft } from "react-icons/fa";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";

export default function HomePage() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);

  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Debounce timer ref
  const debounceTimer = useRef(null);

  // Load menuData on mount
  useEffect(() => {
    const stored = localStorage.getItem("menuData");
    if (stored) {
      try {
        setMenuData(JSON.parse(stored));
      } catch {
        fetchAndInitialize();
      }
    } else {
      fetchAndInitialize();
    }

    function fetchAndInitialize() {
      fetch("/menuData.json")
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch menuData.json");
          return res.json();
        })
        .then((jsonData) => {
          setMenuData(jsonData);
          localStorage.setItem("menuData", JSON.stringify(jsonData));
        })
        .catch((err) => console.error(err));
    }
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Persist recent searches
  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (searchQuery.trim() === "") {
      setShowResults(false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      runSearch(searchQuery.trim());
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  // Actual search logic
  const runSearch = (query) => {
    if (!query) return;
    const lower = query.toLowerCase();
    const matches = [];
    menuData.forEach((section) => {
      section.items.forEach((item) => {
        if (item.name.toLowerCase().includes(lower)) {
          matches.push(item);
        }
      });
    });

    // Update recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((term) => term.toLowerCase() !== lower);
      const newList = [query, ...filtered];
      return newList.slice(0, 5);
    });

    setSearchResults(matches);
    setShowResults(true);
  };

  // Input change handler
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Recent click
  const handleRecentClick = (term) => {
    setSearchQuery(term);
    runSearch(term);
    inputRef.current && inputRef.current.blur();
  };

  // Remove one recent term
  const handleRemoveRecent = (termToRemove) => {
    setRecentSearches((prev) => prev.filter((t) => t !== termToRemove));
  };

  // Clear all recents
  const handleClearRecents = () => {
    setRecentSearches([]);
  };

  // Back from results
  const handleBackFromResults = () => {
    setShowResults(false);
    setSearchQuery("");
    inputRef.current && inputRef.current.focus();
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="header-top">
          <img src={logo} alt="main-logo" />
          <div className="icons">
            <span role="img" aria-label="cart">
              🛒
            </span>
          </div>
        </div>

        <div className="search-wrapper">
          {/* Conditionally render the icon: ◀️ when showing results, 🔍 otherwise */}
          <span
            className="search-icon"
            onClick={() => {
              if (showResults) {
                // If currently showing results, this acts as “back”
                handleBackFromResults();
              } else if (searchQuery.trim()) {
                // Otherwise, run a one‐off search if there's text
                runSearch(searchQuery.trim());
                inputRef.current && inputRef.current.blur();
              }
            }}
            role="button"
            aria-label={showResults ? "Back" : "Search"}
          >
            {showResults ? <ArrowLeftIcon /> : "🔍"}
          </span>

          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Menu, Type or keyword"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay hiding recents to allow clicks
              setTimeout(() => setIsFocused(false), 150);
            }}
          />
        </div>
      </header>

      {showResults ? (
        <div className="search-results-container">
          <h2 className="search-results-title">Search Results</h2>
          {searchResults.length > 0 ? (
            <ul className="search-results-list">
              {searchResults.map((item, i) => (
                <li
                  key={i}
                  className="search-result-item"
                  onClick={() =>
                    navigate("/detail", {
                      state: { item },
                    })
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="search-result-image"
                  />
                  <div className="search-result-info">
                    <p className="search-result-name">{item.name}</p>
                    <p className="search-result-price">Rp. {item.price}</p>
                  </div>
                  <button className="add-btn">+</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results-text">
              No items found for “{searchQuery}”.
            </p>
          )}
        </div>
      ) : (
        <>
          {isFocused &&
            searchQuery.trim() === "" &&
            recentSearches.length > 0 && (
              <div className="recent-searches-container">
                <div className="recent-searches-header">
                  <h3>Recent searches</h3>
                  <button
                    className="clear-recents-btn"
                    onClick={handleClearRecents}
                  >
                    Clear recent searches
                  </button>
                </div>
                <div className="recent-searches-list">
                  {recentSearches.map((term, idx) => (
                    <div key={idx} className="recent-search-item">
                      <div
                        className="recent-search-info"
                        onMouseDown={() => handleRecentClick(term)}
                      >
                        <p className="recent-search-text">{term}</p>
                      </div>
                      <button
                        className="remove-recent-btn"
                        onMouseDown={() => handleRemoveRecent(term)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <MenuSection data={menuData} />
        </>
      )}
    </div>
  );
}
