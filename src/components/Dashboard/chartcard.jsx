import React from 'react'
import ApexChart from 'react-apexcharts'
export default function ChartCard() {
  return (
    <div>
        <div className="col-md-6 p-1">
            <ApexChart
                type={type}
                width="100%"
                height="350"
                options={options}
                series={series}
            />
        </div>
    </div>
  )
}
