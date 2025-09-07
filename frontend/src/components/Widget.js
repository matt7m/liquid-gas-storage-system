import React from "react";

function Widget({ title, value, extra }) {
    return (
        <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "8px", background: "#fff" }}>
            <h4>{title}</h4>
            <h2>{value}</h2>
            {extra && <p>{extra}</p>}
        </div>
    );
}

export default Widget;