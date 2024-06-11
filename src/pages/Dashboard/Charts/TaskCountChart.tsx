
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

        let isHaveTask = false
        column?.cards.map((card: any) => {
            if (!card.fromDate || !card.deadlineDate) return
            isHaveTask = true
            countCard++
        })

        if (isHaveTask) {
            series.push(countCard)
            labels.push(columnName)
        }
    })

    return {
        series,
        labels
    } as ChartData
}

const TaskCountChart: React.FC<TimelineCharstProps> = ({ boardInfo }) => {
    const [data, setData] = React.useState(null)

    const buildData = async () => {

        const chartData = await buildTimeLineChartData(boardInfo)

        setData({
            series: chartData.series,
            options: {
                chart: {
                    width: 380,
                    type: 'pie'
                },
                labels: chartData.labels,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }],
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'left'
                }
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
        <ReactApexChart options={data.options} series={data.series} type="pie" height={350} />
    )
}

export default TaskCountChart