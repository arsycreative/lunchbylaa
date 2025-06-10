import React from "react";

const NotFoundPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.statusText || error.message}</p>
      <a href={import.meta.env.BASE_URL || "/"}>Go home</a>
    </div>
  );
};

export default NotFoundPage;
