
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

interface MemberInfo {
    id: string
    fullName: string
    taskCount: number
    finishedTaskCount: number
}

const buildTimeLineChartData = (boardInfo: any): ChartData => {
    const memberInfos: MemberInfo[] = []

    boardInfo?.columns.map((column: any) => {
        column?.cards.map((card: any) => {
            if (!card.fromDate || !card.deadlineDate) return

            card.members.map((member: any) => {
                const memberInfo = memberInfos.find((m) => m.id === member.id)
                if (memberInfo) {
                    memberInfo.taskCount++
                    if (card.workingStatus === 1) {
                        memberInfo.finishedTaskCount++
                    }
                } else {
                    memberInfos.push({
                        id: member.id,
                        fullName: member.fullName,
                        taskCount: 1,
                        finishedTaskCount: card.workingStatus === 1 ? 1 : 0
                    })
                }
            })
        })
    })

    const series: number[] = []
    const labels: string[] = []

    memberInfos.map((memberInfo) => {
        series.push(memberInfo.finishedTaskCount / memberInfo.taskCount * 100)
        labels.push(memberInfo.fullName)
    })

    return {
        series,
        labels
    } as ChartData
}

const MemberWorkingStatusChart: React.FC<TimelineCharstProps> = ({ boardInfo }) => {
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

export default MemberWorkingStatusChart