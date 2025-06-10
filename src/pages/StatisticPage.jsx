// src/pages/StatisticPage.jsx

import React, { useState, useEffect } from "react";
import "./StatisticPage.css";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import BackIcon from "../components/icons/BackIcon";

// ← Replace <YOUR_TAB_NAME> with the actual tab name in your sheet (e.g. "Sheet1")
const GOOGLE_SHEETS_ENDPOINT =
  "https://v1.nocodeapi.com/arsy/google_sheets/YyUxVYajMvWhKiuY?tabId=Sheet1";

const StatisticPage = () => {
  const [isSummary, setIsSummary] = useState(true);
  const [sheetData, setSheetData] = useState([]); // Array of objects from `response.data`
  const [yearFilter, setYearFilter] = useState("2025"); // default year to filter
  const navigate = useNavigate();

  // 1) Fetch the sheet data on mount (object-based)
  useEffect(() => {
    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((response) => {
        // response.data is an array of objects, each with keys:
        // { row_id, Timestamp, Name, Level, Price, Quantity, Subtotal, TotalOrderValue }
        console.log("sheet response:", response);
        if (Array.isArray(response.data)) {
          setSheetData(response.data);
        } else {
          console.error(
            "Expected response.data to be an array, got:",
            response.data
          );
        }
      })
      .catch((err) => {
        console.error("Failed to fetch Google Sheets data:", err);
      });
  }, []);

  // 2) Filter rows by selected year (using the Timestamp field)
  const rowsForYear = sheetData.filter((row) => {
    const timestamp = row.Timestamp; // e.g. "2025-06-09T15:18:40.909Z"
    const rowYear = new Date(timestamp).getFullYear().toString();
    return rowYear === yearFilter;
  });

  // 3) Compute summary metrics from rowsForYear

  // A) Total Penjualan: sum of unique checkout totals, grouped by timestamp
  const totalsByTimestamp = {};
  rowsForYear.forEach((row) => {
    const ts = row.Timestamp;
    if (!totalsByTimestamp[ts]) {
      // Parse TotalOrderValue (may include non-digits like dots or "Rp.")
      const num =
        parseInt(row.TotalOrderValue?.toString().replace(/[^\d]/g, ""), 10) ||
        0;
      totalsByTimestamp[ts] = num;
    }
  });
  const totalPenjualan = Object.values(totalsByTimestamp).reduce(
    (a, b) => a + b,
    0
  );

  // B) Total Item Terjual: sum of all quantities across rowsForYear
  const totalItemsTerjual = rowsForYear.reduce((sum, row) => {
    const quantity =
      parseInt(row.Quantity?.toString().replace(/[^\d]/g, ""), 10) || 0;
    return sum + quantity;
  }, 0);

  // C) Produk Terlaris: find product name with highest total quantity
  const qtyByProduct = {};
  rowsForYear.forEach((row) => {
    const name = row.Name;
    const quantity =
      parseInt(row.Quantity?.toString().replace(/[^\d]/g, ""), 10) || 0;
    if (!qtyByProduct[name]) qtyByProduct[name] = 0;
    qtyByProduct[name] += quantity;
  });
  let produkTerlaris = "–";
  if (Object.keys(qtyByProduct).length > 0) {
    produkTerlaris = Object.entries(qtyByProduct).reduce(
      (best, [name, qty]) => {
        return qty > best.qty ? { name, qty } : best;
      },
      { name: "", qty: 0 }
    ).name;
  }

  // 4) Build an array of “transactions” for the table: one entry per unique timestamp
  const transactions = Object.entries(totalsByTimestamp)
    .map(([timestamp, totalValue]) => ({
      timestamp,
      totalValue,
    }))
    // Sort descending by timestamp
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // 5) Render JSX
  return (
    <div className="statistic-page">
      <div className="statistic-page__back" onClick={() => navigate(-1)}>
        <BackIcon /> <span>Back</span>
      </div>

      <h2 className="statistic-page__title">STATISTIC</h2>
      <span className="statistic-page__subtitle">
        {isSummary ? "SUMMARY" : "TABEL TRANSAKSI TERAKHIR"}
      </span>

      <div className="statistic-page__view-toggle">
        <FaBars onClick={() => setIsSummary(!isSummary)} />

        {/* Only show year dropdown when in summary mode */}
        {isSummary && (
          <select
            className="statistic-page__dropdown"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            {/* Add more years if needed */}
          </select>
        )}
      </div>

      {isSummary ? (
        <div className="statistic-page__summary">
          {/* Card: Total Penjualan */}
          <div className="statistic-page__summary-card">
            <p>Total Penjualan ({yearFilter})</p>
            <h3>Rp. {totalPenjualan.toLocaleString()}</h3>
          </div>

          {/* Card: Produk Terlaris */}
          <div className="statistic-page__summary-card">
            <p>Produk Terlaris ({yearFilter})</p>
            <h3>{produkTerlaris || "–"}</h3>
          </div>

          {/* Card: Total Item Terjual */}
          <div className="statistic-page__summary-card">
            <p>Total Item Terjual ({yearFilter})</p>
            <h3>{totalItemsTerjual.toLocaleString()}</h3>
          </div>
        </div>
      ) : (
        <div className="statistic-page__table-wrapper">
          <table className="statistic-page__table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Total Pembelian (Rp.)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => {
                const dateObj = new Date(tx.timestamp);
                const formattedDate = dateObj.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });

                return (
                  <tr key={tx.timestamp}>
                    <td>{idx + 1}</td>
                    <td>{formattedDate}</td>
                    <td>Rp. {tx.totalValue.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatisticPage;
