import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import {CategoryScale, PointElement, LineElement} from 'chart.js'; 

ChartJS.register(LinearScale, Title, Tooltip, Legend, CategoryScale, PointElement, LineElement);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const randomData = labels.map(() => Math.floor(Math.random() * 1000));

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Dataset 2',
      data: randomData,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export default function PerformanceGraph() {
  return <Line options={options} data={data} />;
}
