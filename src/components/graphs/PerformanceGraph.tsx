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
import { differenceInDays, startOfWeek, startOfMonth } from "date-fns";

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
        unit: "day",
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

  const averageDataPoints = (snapshots: Snapshots[], interval: string) => {
    const aggregatedData: { [key: string]: { total: number; count: number } } =
      {};
    snapshots.forEach((snapshot) => {
      let dateKey = snapshot.Date.split("T")[0]; // Daily by default

      if (interval === "weekly") {
        dateKey = startOfWeek(new Date(snapshot.Date))
          .toISOString()
          .split("T")[0];
      } else if (interval === "monthly") {
        dateKey = startOfMonth(new Date(snapshot.Date))
          .toISOString()
          .split("T")[0];
      }

      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { total: 0, count: 0 };
      }
      aggregatedData[dateKey].total += snapshot.Value;
      aggregatedData[dateKey].count += 1;
    });

    return Object.keys(aggregatedData).map((key) => ({
      Date: key,
      Value: aggregatedData[key].total / aggregatedData[key].count,
    }));
  };

  // Determine the aggregation interval
  const determineInterval = (start: any, end: any) => {
    const dayDifference = differenceInDays(end, start);
    if (dayDifference <= 30) {
      return "daily";
    } else if (dayDifference <= 365) {
      return "weekly";
    } else {
      return "monthly";
    }
  };

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
      const interval = determineInterval(start, end);
      const aggregatedData = averageDataPoints(
        responseData.Snapshots,
        interval
      );

      const labels = aggregatedData.map((item) => item.Date);
      const values = aggregatedData.map((item) => item.Value);

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

  const determineTimeUnit = () => {
    if (!startDate || !endDate) return "month";

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    // Check if the dates are in the same year and either the same month or adjacent months
    if (
      startYear === endYear &&
      (endMonth === startMonth || endMonth === startMonth + 1)
    ) {
      return "day";
    } else if (
      startYear === endYear ||
      (startYear + 1 === endYear && startMonth >= endMonth)
    ) {
      return "month";
    } else {
      return "year";
    }
  };

  // Update the options dynamically based on the selected date range
  const dynamicOptions: ChartOptions<"line"> = {
    ...options,
    scales: {
      ...options.scales,
      x: {
        ...options.scales.x,
        time: {
          unit: determineTimeUnit(),
        },
      },
    },
  };

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
      <Line options={dynamicOptions} data={chartData} />
    </div>
  );
}
