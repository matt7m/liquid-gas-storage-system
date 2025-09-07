import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
    { name: "appliances", value: 4544 },
    { name: "drinks", value: 3321 },
    { name: "health", value: 3113 },
    { name: "clothing", value: 2341 },
    { name: "baby", value: 1231 },
    { name: "others", value: 132 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"];

function ChartDonut() {
    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                cx={200}
                cy={150}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                label
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
}

export default ChartDonut;