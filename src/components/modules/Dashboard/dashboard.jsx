import { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import Loader from '../../shared/loader/Loader';
import axios from 'axios';
import Wallet from '../../../assets/icons/wallet';
import Coin from '../../../assets/icons/coin';
import TwentyFour from '../../../assets/icons/TwentyFour';
import HandLoveIcon from '../../../assets/icons/handloveicon';
import Cookies from 'js-cookie';
import { api } from '../../../hooks/axiosinstance';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState({});
    const [incomesChartData, setIncomesChartData] = useState({
        chartOptions: {
            title: {
                text: 'Current Month Incomes',
                align: 'left',
                style: { color: '#475f7b' },
            },
            chart: {
                id: 'incomes_chart',
            },
            xaxis: {
                categories: [],
            },
        },
        series: [
            {
                name: 'income',
                data: [],
            },
        ],
    });
    const [expensesChartData, setExpensesChartData] = useState({
        chartOptions: {
            title: {
                text: 'Current Month Expenses',
                align: 'left',
                style: { color: '#475f7b' },
            },
            chart: {
                id: 'expenses_chart',
            },
            xaxis: {
                categories: [],
            },
        },
        series: [
            {
                name: 'expenses',
                data: [],
            },
        ],
    });
    const [incomeCatData, setIncomeCatData] = useState({
        series: [],
        chartOptions: {
            title: {
                text: 'Income Categories',
                align: 'left',
                style: { color: '#475f7b' },
            },
            labels: [],
            theme: {
                monochrome: {
                    enabled: true,
                },
            },
        },
    });
    const [expenseCatData, setExpenseCatData] = useState({
        series: [],
        chartOptions: {
            title: {
                text: 'Expense Categories',
                align: 'left',
                style: { color: '#475f7b' },
            },
            labels: [],
            theme: {
                monochrome: {
                    enabled: true,
                },
            },
        },
    });

    const fetchData = async () => {
        setLoading(true);
        const accessToken = Cookies.get('accessToken');
        try {
            const response = await api.get('/api/dashboard');
            const data = response.data;

            setReportData(data);

            if (data && Array.isArray(data.current_month_incomes)) {
                setIncomesChartData((prevState) => ({
                    ...prevState,
                    chartOptions: {
                        ...prevState.chartOptions,
                        xaxis: {
                            categories: data.current_month_incomes.map((income) => income.date),
                        },
                    },
                    series: [
                        {
                            name: 'income',
                            data: data.current_month_incomes.map((income) => income.amount),
                        },
                    ],
                }));
            }

            if (data && Array.isArray(data.current_month_expenses)) {
                setExpensesChartData((prevState) => ({
                    ...prevState,
                    chartOptions: {
                        ...prevState.chartOptions,
                        xaxis: {
                            categories: data.current_month_expenses.map((expense) => expense.date),
                        },
                    },
                    series: [
                        {
                            name: 'expenses',
                            data: data.current_month_expenses.map((expense) => expense.amount),
                        },
                    ],
                }));
            }

            if (data && Array.isArray(data.incomeCatData)) {
                setIncomeCatData((prevState) => ({
                    ...prevState,
                    chartOptions: {
                        ...prevState.chartOptions,
                        labels: data.incomeCatData.map((income) => income.name),
                    },
                    series: data.incomeCatData.map((income) => income.incomes_count),
                }));
            }

            if (data && Array.isArray(data.expenseCatData)) {
                setExpenseCatData((prevState) => ({
                    ...prevState,
                    chartOptions: {
                        ...prevState.chartOptions,
                        labels: data.expenseCatData.map((expense) => expense.name),
                    },
                    series: data.expenseCatData.map((expense) => expense.expenses_count),
                }));
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard-page">
            {loading && <Loader />}
            {!loading && (
                <div className="dashboard-page-contents mx-2">
                    <div className="dashboard-top-stats row flex-wrap">
                        {/* Current Month Income */}
                        <div className="col-md-3 col-sm-6 my-1 p-1 min150">
                            <div className="bg-white shadow-sm d-flex flex-wrap rounded-3 p-3 align-items-center">
                                <div className="bg-info p-3 rounded-3 me-4">
                                    <TwentyFour color="white" width={28} height={28} />
                                </div>
                                <div className="my-2">
                                    <span className="h3">{reportData.todays_income}</span>
                                    <br />
                                    <span className="text-muted fs-6">Today Incomes</span>
                                </div>
                            </div>
                        </div>
                        {/* Total Income */}
                        <div className="col-md-3 col-sm-6 my-1 p-1 min150">
                            <div className="bg-white shadow-sm d-flex flex-wrap rounded-3 p-3 align-items-center">
                                <div className="bg-info p-3 rounded-3 me-4">
                                    <Wallet color="white" width={28} height={28} />
                                </div>
                                <div className="my-2">
                                    <span className="h3">{reportData.total_income}</span>
                                    <br />
                                    <span>Total Incomes</span>
                                </div>
                            </div>
                        </div>
                        {/* Total Expenses */}
                        <div className="col-md-3 col-sm-6 my-1 p-1 min150">
                            <div className="bg-white shadow-sm d-flex flex-wrap rounded-3 p-3 align-items-center">
                                <div className="bg-info p-3 rounded-3 me-4">
                                    <Coin color="white" width={28} height={28} />
                                </div>
                                <div className="my-2">
                                    <span className="h3">{reportData.total_expenses}</span>
                                    <br />
                                    <span>Total Expenses</span>
                                </div>
                            </div>
                        </div>
                        {/* Net Income */}
                        <div className="col-md-3 col-sm-6 my-1 p-1 min150">
                            <div className="bg-white shadow-sm d-flex flex-wrap rounded-3 p-3 align-items-center">
                                <div className="bg-info p-3 rounded-3 me-4">
                                    <HandLoveIcon color="white" width={28} height={28} />
                                </div>
                                <div className="my-2">
                                    <span className="h3">{reportData.net_incomes}</span>
                                    <br />
                                    <span>Net Incomes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-charts my-3 row">
                        <div className="col-md-6 p-1">
                            <ApexCharts
                                width="100%"
                                height={350}
                                type="bar"
                                options={incomesChartData.chartOptions}
                                series={incomesChartData.series}
                            />
                        </div>
                        <div className="col-md-6 p-1">
                            <ApexCharts
                                width="100%"
                                height={350}
                                type="bar"
                                options={expensesChartData.chartOptions}
                                series={expensesChartData.series}
                            />
                        </div>
                    </div>
                    <div className="dashboard-charts my-3 row">
                        <div className="col-md-6 p-1">
                            <ApexCharts
                                type="pie"
                                width="100%"
                                options={incomeCatData.chartOptions}
                                series={incomeCatData.series}
                            />
                        </div>
                        <div className="col-md-6 p-1">
                            <ApexCharts
                                type="pie"
                                width="100%"
                                options={expenseCatData.chartOptions}
                                series={expenseCatData.series}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
