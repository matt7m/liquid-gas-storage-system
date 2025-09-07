import React from "react";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

const data = [
    { name: "Mon", value: 400 },
    { name: "Tue", value: 300 },
    { name: "Wed", value: 500 },
    { name: "Thu", value: 200 },
    { name: "Fri", value: 600 },
];

function ChartBar() {
    return (
        <BarChart width={400} height={200} data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
    );
}

export default ChartBar;