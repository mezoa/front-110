import React from 'react'
import InfoCard from './infocard'
import ChartCard from './chartcard'
import TwentyFour from '../../../assets/icons/TwentyFour'

const Dashboard = ({ loading, report_data, incomes_chart_data, expenses_chart_data, incomeCatData, expenseCatData }) => {
  return (
    <div>
        <div className="dashboard-page">
            <div className="dashboard-page-contents mx-2">
                <div className="dashboard-top-stats row flex-wrap">
                    <InfoCard
                        icon={<TwentyFour color="white" width="28" height="28" />}
                        value={report_data.today_incomes}
                        label="Today Incomes"
                    />
                    <InfoCard
                        icon={<TwentyFour color="white" width="28" height="28" />}
                        value={report_data.total_incomes}
                        label="Total Incomes"
                    />
                    <InfoCard
                        icon={<TwentyFour color="white" width="28" height="28" />}
                        value={report_data.total_expenses}
                        label="Total Expenses"
                    />
                    <InfoCard
                        icon={<TwentyFour color="white" width="28" height="28" />}
                        value={report_data.net_incomes}
                        label="Net Incomes"
                    />
                </div>
                <div className="dashboard-charts my-3 row">
                    <ChartCard
                        type="bar"
                        options={incomes_chart_data.chartOptions}
                        series={incomes_chart_data.series}
                    />
                    <ChartCard
                        type="bar"
                        options={expenses_chart_data.chartOptions}
                        series={expenses_chart_data.series}
                    />
                </div>
                <div className="dashboard-charts my-3 row">
                    <ChartCard
                        type="pie"
                        options={incomeCatData.chartOptions}
                        series={incomeCatData.series}
                    />
                    <ChartCard
                        type="pie"
                        options={expenseCatData.chartOptions}
                        series={expenseCatData.series}
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard