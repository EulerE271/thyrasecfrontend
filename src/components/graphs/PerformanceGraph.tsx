import axios from "axios";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import "chartjs-adapter-date-fns";
import { useParams } from "react-router-dom";
import { ChartOptions } from "chart.js";

Chart.register(...registerables);

interface Snapshots {
  Date: Date;
  Value: number;
}

export const options: ChartOptions<"line"> = {
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "month",
      },
      title: {
        display: true,
        text: "Date",
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const, // Type assertion here
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

export default function PerformanceGraph() {
  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2023-01-01")
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2024-01-01"));
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  }>({ labels: [], datasets: [] });
  const { id } = useParams();
  // Function to fetch data from the backend
  const fetchData = async (start: Date | null, end: Date | null) => {
    if (!start || !end) {
      return;
    }

    try {
      const response = await axios.get(`v1/user/${id}/performance-change`, {
        withCredentials: true,
        params: {
          startDate: start.toISOString().split("T")[0],
          endDate: end.toISOString().split("T")[0],
        },
      });

      const responseData = response.data;
      // Extracting snapshot data
      const snapshotData = responseData.Snapshots || [];
      const labels = snapshotData.map(
        (snapshot: Snapshots) => snapshot.Date.split("T")[0]
      );
      const values = snapshotData.map((snapshot: Snapshots) => snapshot.Value);

      // Since the response is a single object, directly use its properties
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Performance Over Time",
            data: values,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Update the data when the date range changes
  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          slots={{
            textField: (textFieldProps) => <TextField {...textFieldProps} />,
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          slots={{
            textField: (textFieldProps) => <TextField {...textFieldProps} />,
          }}
        />
      </LocalizationProvider>
      <Line options={options} data={chartData} />
    </div>
  );
}
