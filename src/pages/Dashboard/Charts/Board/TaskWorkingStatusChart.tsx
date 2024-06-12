
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

export interface TimelineCharstProps {
    boardInfo: any
}

interface ChartData {
    series: number[]
    labels: string[]
}

const buildTimeLineChartData = (boardInfo: any): ChartData => {
    const series: number[] = []
    const labels: string[] = []

    boardInfo?.columns.map((column: any) => {
        const columnName = column.title
        let countCard = 0
        let countFinsihedCard = 0

        let isHaveTask = false
        column?.cards.map((card: any) => {
            if (!card.fromDate || !card.deadlineDate) return
            isHaveTask = true
            countCard++
            if (card.workingStatus === 1) {
                countFinsihedCard++
            }
        })

        if (isHaveTask) {
            const percent = Math.round((countFinsihedCard / countCard) * 100)
            series.push(percent)
            labels.push(columnName)
        }
    })

    return {
        series,
        labels
    } as ChartData
}

const TaskWorkingStatusChart: React.FC<TimelineCharstProps> = ({ boardInfo }) => {
    const [data, setData] = React.useState(null)

    const buildData = async () => {

        const chartData = await buildTimeLineChartData(boardInfo)

        setData({
            series: chartData.series,
            options: {
                chart: {
                    height: 350,
                    type: 'radialBar'
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            name: {
                                fontSize: '22px'
                            },
                            value: {
                                fontSize: '16px'
                            },
                            total: {
                                show: true,
                                label: 'Total',
                                formatter: function (w: any) {
                                    const series = w?.config?.series
                                    const avg = parseFloat((series.reduce((a: number, b: number) => a + b, 0) / series.length).toFixed(2));
                                    return `${avg}%`
                                }
                            }
                        }
                    }
                },
                labels: chartData.labels
            }
        })
    }

    React.useEffect(() => {
        if (!boardInfo) return
        buildData()
    }, [boardInfo])

    if (!data) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <ReactApexChart options={data.options} series={data.series} type="radialBar" height={350} />
    )
}

export default TaskWorkingStatusChart