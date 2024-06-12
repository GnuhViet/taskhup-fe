
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ApiLoadingOverlay from '~/components/Common/ApiLoadingOverlay'

export interface TimelineCharstProps {
    listBoardInfo: any
}

interface ChartData {
    series: number[]
    labels: string[]
}

const buildTimeLineChartData = (listBoardInfo: any): ChartData => {
    const series: number[] = []
    const labels: string[] = []

    listBoardInfo.map((boardInfo: any) => {
        const boardName = boardInfo.title
        let countTotalTask = 0
        let isHaveAnyTask = false
        boardInfo?.columns.map((column: any) => {
            let countCard = 0

            let isHaveTask = false
            column?.cards.map((card: any) => {
                if (!card.fromDate || !card.deadlineDate) return
                isHaveTask = true
                countCard++
            })

            if (isHaveTask) {
                isHaveAnyTask = true
                countTotalTask += countCard
            }
        })
        if (isHaveAnyTask) {
            isHaveAnyTask = true
            series.push(countTotalTask)
            labels.push(boardName)
        }
    })

    return {
        series,
        labels
    } as ChartData
}

const BoardTaskCountChart: React.FC<TimelineCharstProps> = ({ listBoardInfo }) => {
    const [data, setData] = React.useState(null)

    const buildData = async () => {

        const chartData = await buildTimeLineChartData(listBoardInfo)

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
        if (!listBoardInfo) return
        buildData()
    }, [listBoardInfo])

    if (!data) {
        return (
            <ApiLoadingOverlay />
        )
    }

    return (
        <ReactApexChart options={data.options} series={data.series} type="pie" height={350} />
    )
}

export default BoardTaskCountChart