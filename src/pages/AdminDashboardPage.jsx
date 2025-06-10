import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboardPage.css";
import Editicon from "../components/icons/Editicon";
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import logo from "../assets/lunchbylaa_logo.png";
import profilePic from "../assets/profile.png";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);

  // --- Search state ---
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // array of {sectionIndex, itemIndex, item}
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
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

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("adminRecentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Persist recent searches whenever it changes
  useEffect(() => {
    localStorage.setItem("adminRecentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Debounced search effect: runSearch after 300ms if query changes
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

  // Perform the search: find all items (across sections) whose name includes the query
  const runSearch = (query) => {
    if (!query) return;
    const lower = query.toLowerCase();
    const matches = [];

    menuData.forEach((section, sIdx) => {
      section.items.forEach((item, iIdx) => {
        if (item.name.toLowerCase().includes(lower)) {
          matches.push({ sectionIndex: sIdx, itemIndex: iIdx, item });
        }
      });
    });

    // Update recent searches (dedupe, newest first, limit to 5)
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

  // When a recent term is clicked
  const handleRecentClick = (term) => {
    setSearchQuery(term);
    runSearch(term);
    // Blur input so recents hide
    if (inputRef.current) inputRef.current.blur();
  };

  // Remove a single recent term
  const handleRemoveRecent = (termToRemove) => {
    setRecentSearches((prev) => prev.filter((t) => t !== termToRemove));
  };

  // Clear all recent searches
  const handleClearRecents = () => {
    setRecentSearches([]);
  };

  // Back from results to normal view
  const handleBackFromResults = () => {
    setShowResults(false);
    setSearchQuery("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="header-top">
          <img src={logo} alt="main-logo" />
          <div className="icons">
            <img src={profilePic} alt="profile" className="profile-circle" />
          </div>
        </div>

        <div className="search-wrapper" style={{ marginTop: "12px" }}>
          <span
            className="search-icon"
            onClick={() => {
              if (showResults) {
                handleBackFromResults();
              } else if (searchQuery.trim()) {
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
              // Delay hiding recents so click can register
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
              {searchResults.map(({ sectionIndex, itemIndex, item }, i) => (
                <li
                  key={i}
                  className="search-result-item"
                  onClick={() =>
                    navigate("/edit", {
                      state: { item, sectionIndex, itemIndex },
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
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      // Prevent the list click from also triggering
                      e.stopPropagation();
                      navigate("/edit", {
                        state: { item, sectionIndex, itemIndex },
                      });
                    }}
                  >
                    <Editicon />
                  </button>
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

          {/* Render all sections & items when not searching */}
          {menuData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section">
              <h2>{section.category}</h2>
              <div className="grid">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="card">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-image"
                    />
                    <div className="card-info">
                      <p className="card-name">{item.name}</p>
                      <p className="card-price">Rp. {item.price}</p>
                    </div>
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate("/edit", {
                          state: { item, sectionIndex, itemIndex },
                        })
                      }
                    >
                      <Editicon />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
