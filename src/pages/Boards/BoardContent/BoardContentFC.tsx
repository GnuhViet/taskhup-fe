import React from 'react'
import Box from '@mui/material/Box'
import ListColumnsFC from './ListColumns/ListColumnsFC'

import {
    DndContext,
    // PointerSensor,
    // MouseSensor,
    // TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    closestCorners,
    // closestCenter,
    pointerWithin,
    // rectIntersection,
    getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/core/utils/customLibraries/DndKitSensors'

import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/core/utils/formatters'
import { createContext } from 'react'

import ColumnFC from './ListColumns/Column/ColumnFC'
import CardFC from './ListColumns/Column/ListCards/Card/CardFC'

import { Board } from '~/core/model/board.model'
import { Card } from '~/core/model/card.model'
import { Column } from '~/core/model/Column.model'
import { useDispatch, useSelector } from 'react-redux'
import { updateColum, updateColumnOrder } from '~/core/redux/slices/boardSlice'
import { useStompClient } from 'react-stomp-hooks'
import { BoardCardMoveReq, BoardColumnMoveReq } from '~/core/services/board-services.model'

const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

class MoveInfo {
    // on start
    active: any // set on over
    over: any // set on over
    activeColumn: any // set on over
    overColumn: any // set on over
    overCardId: any
    activeDraggingCardId: any
    activeDraggingCardData: any
    // on over
    currentDragItemId: any // set on start
    currentDragItemData: any // set on start
    oldColumnWhenDragCard: any // set on start
}

const moveInfo = new MoveInfo()

interface BoadContentFCProps {
    // board: Board,
    // moveCardInTheSameColumn: () => void,
    // moveCardToDifferentColumn: () => void,
    // deleteColumnDetails: () => void
}

const BoardContentFC: React.FC<BoadContentFCProps> = () => {
    const disableDrag = useSelector((state: any) => state.boardReducer.disableDrag)

    //<editor-fold desc="Sensor custom">
    // https://docs.dndkit.com/api-documentation/sensors
    // Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả - nhưng mà còn bug
    // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
    // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
    // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug.
    // const sensors = useSensors(pointerSensor)
    const sensors = useSensors(mouseSensor, touchSensor)
    // Điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm, video 37)
    const lastOverId = useRef(null)
    //</editor-fold>

    //<editor-fold desc="Hook & init state">

    const board: Board = useSelector((state: any) => state.boardReducer.board)
    const boardId = useSelector((state: any) => state.boardReducer.boardId)
    const columns: Column[] = useSelector((state: any) => state.boardReducer.board.columns)

    // Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
    // const [CurrentDragItemId, setCurrentDragItemId] = useState(null)
    const [ActiveDragItemType, setActiveDragItemType] = useState(null)
    const [CurrentDragItemData, setCurrentDragItemData] = useState(null)
    // const [OldColumnWhenDragCard, setOldColumnWhenDragCard] = useState(null)
    // const [OverColumnWhenDragCard, setOverColumnWhenDragCard] = useState(null)
    const [IsMoveCardBetweenDifferentColumns, setIsMoveCardBetweenDifferentColumns] = useState(null)

    const dispatch = useDispatch()
    const stompClient = useStompClient()

    // useEffect(() => {
    //     if (board) {
    //         setOrderedColumns(board.columns)
    //     }
    //     // Columns đã được sắp xếp ở component cha cao nhất (boards/_id.jsx) (Video 71 đã giải thích lý do)
    // }, [board])
    // //</editor-fold>

    //<editor-fold desc="Utils">
    // Tìm một cái ColumnFC theo CardId
    const findColumnById = (id: string) => {
        return board.columns.find(column => column.id === id)
    }

    // Khởi tạo Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các ColumnFC khác nhau.
    const moveCardBetweenDifferentColumns = (isTriggerFromDragEnd: boolean) => {
        const {
            active,
            over,
            activeColumn,
            overColumn,
            overCardId,
            activeDraggingCardId,
            activeDraggingCardData,
            oldColumnWhenDragCard: OldColumnWhenDragCard
        } = moveInfo

        if (isTriggerFromDragEnd) {
            1 === 1
        }

        // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex((card: Card) => card.id === overCardId)


        // Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện - nhiều khi muốn từ chối hiểu =))
        const isBelowOverItem = active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        const newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderedColumnsState mới
        const nextColumns = cloneDeep(columns)
        const nextActiveColumn = nextColumns.find(column => column.id === activeColumn.id)
        const nextOverColumn = nextColumns.find(column => column.id === overColumn.id)

        // nextActiveColumn: ColumnFC cũ
        if (nextActiveColumn) {
            // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
            nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card.id !== activeDraggingCardId)

            // Thêm Placeholder Card nếu ColumnFC rỗng: Bị kéo hết Card đi, không còn cái nào nữa. (Video 37.2)
            if (isEmpty(nextActiveColumn.cards)) {
                nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
            }

            // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
            nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card.id)

        }

        // nextOverColumn: ColumnFC mới
        if (nextOverColumn) {
            // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
            nextOverColumn.cards = nextOverColumn.cards.filter(card => card.id !== activeDraggingCardId)

            // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau.
            const rebuild_activeDraggingCardData = {
                ...activeDraggingCardData,
                columnId: nextOverColumn.id
            }

            if (rebuild_activeDraggingCardData.hasOwnProperty('sortable'))
                delete rebuild_activeDraggingCardData.sortable

            // @ts-ignore
            const newCardDatas = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

            // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
            nextOverColumn.cards = newCardDatas

            // Xóa cái Placeholder Card đi nếu nó đang tồn tại (Video 37.2)
            nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

            // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
            nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card.id)
        }

        // setOverColumnWhenDragCard(nextOverColumn)
        //
        // const currentDrag = CurrentDragItemData
        // currentDrag.title = 'hello woksadfa'
        // currentDrag.columnId = nextOverColumn.id
        // setCurrentDragItemData(currentDrag)

        setIsMoveCardBetweenDifferentColumns(true)
        // setOrderedColumns(nextColumns)
        dispatch(updateColum(nextColumns))

        // Nếu function này được gọi từ handleDragEnd nghĩa là đã kéo thả xong, lúc này mới xử lý gọi API 1 lần ở đây
        if (isTriggerFromDragEnd) {

            //TODO Call api here
            // data: nextActiveColumn
            // data: nextOverColumn
            // data: nextColumns
            // data: activeDraggingCardData

            if (stompClient) {
                const req = {
                    cardId: activeDraggingCardId,
                    fromColumnId: OldColumnWhenDragCard.id,
                    toColumnId: nextOverColumn.id,
                    cardOrderIds: nextOverColumn.cardOrderIds
                } as BoardCardMoveReq

                // console.log('req: ', req)

                stompClient.publish({
                    destination: `/app/board/${boardId}/moveCard`,
                    body: JSON.stringify(req)
                })
            }

            /**
             * Gọi lên props function moveCardToDifferentColumn nằm ở component cha cao nhất (boards/_id.jsx)
             * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ với mình thì chúng ta sẽ đưa dữ liệu Board ra ngoài Redux Global Store,
             * và lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì phải lần lượt gọi ngược lên những component cha phía bên trên. (Đối với component con nằm càng sâu thì càng khổ :D)
             * - Với việc sử dụng Redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều.
             */
            // Phải dùng tới activeDragItemData.columnId hoặc tốt nhất là oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver và tới đây là state của card đã bị cập nhật một lần rồi.
            // moveCardToDifferentColumn(
            //     activeDraggingCardId,
            //     oldColumnWhenDraggingCard.id,
            //     nextOverColumn.id,
            //     nextColumns
            // )
        }
    }
    //</editor-fold>

    //<editor-fold desc="DnD handler">
    // Trigger khi bắt đầu kéo (drag) một phần tử
    const handleDragStart = (event: any) => {
        if (disableDrag) return

        moveInfo.currentDragItemId = event?.active?.id
        moveInfo.currentDragItemData = event?.active?.data?.current


        // console.log('handleDragStart: ', event)
        // setCurrentDragItemId(event?.active?.id)
        setCurrentDragItemData(event?.active?.data?.current)
        setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)

        // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
        if (event?.active?.data?.current?.columnId) {
            moveInfo.oldColumnWhenDragCard = findColumnById(event?.active?.data?.current?.columnId)
            // setOldColumnWhenDragCard(findColumnById(event?.active?.data?.current?.columnId))
        }
    }

    // Trigger trong quá trình kéo (drag) một phần tử
    const handleDragOver = (event: any) => {
        if (disableDrag) return

        if (ActiveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

        // xử lý move card
        const { active, over } = event

        // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container)
        // thì không làm gì (tránh crash trang)
        if (!active || !over) return

        if (active.id === over.id) return

        // activeDraggingCard: Là cái card đang được kéo
        const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
        // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
        const { id: overCardId } = over

        // Tìm 2 cái columns theo cardId
        const activeColumn = findColumnById(active?.data?.current?.columnId)
        const overColumn = findColumnById(over?.data?.current?.columnId)

        // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
        if (!activeColumn || !overColumn) return

        moveInfo.active = active
        moveInfo.over = over
        moveInfo.activeColumn = activeColumn
        moveInfo.overColumn = overColumn
        moveInfo.overCardId = overCardId
        moveInfo.activeDraggingCardId = activeDraggingCardId
        moveInfo.activeDraggingCardData = activeDraggingCardData

        // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
        // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
        if (activeColumn.id === overColumn.id) {
            setIsMoveCardBetweenDifferentColumns(false)
            return
        }

        moveCardBetweenDifferentColumns(
            // overColumn,
            // overCardId,
            // active,
            // over,
            // activeColumn,
            // activeDraggingCardId,
            // activeDraggingCardData,
            false
        )
    }

    // Trigger khi kết thúc hành động kéo (drag) một phần tử => hành động thả (drop)
    const handleDragEnd = (event: any) => {
        if (disableDrag) return

        const {
            oldColumnWhenDragCard: OldColumnWhenDragCard,
            currentDragItemId: CurrentDragItemId,
            activeColumn: ActiveColumn,
            overColumn: OverColumn,
            overCardId: OverCardId,
            activeDraggingCardId: ActiveDraggingCardId,
            activeDraggingCardData: ActiveDraggingCardData
        } = moveInfo

        // console.log('handleDragEnd: ', event)
        const { active, over } = event

        // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì (tránh crash trang)
        if (!active || !over) return

        // Xử lý kéo thả Cards
        if (ActiveDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            // // activeDraggingCard: Là cái card đang được kéo
            // const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
            // // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên.
            // const { id: overCardId } = over
            //
            // // board.columns.find(column => column.id === active.data.columnId)
            // // Tìm 2 cái columns theo cardId
            // const activeColumn = findColumnById(active.data.current.columnId) //findColumnByCardId(activeDraggingCardId)
            // const overColumn = findColumnById(over.data.current.columnId) //findColumnByCardId(overCardId)

            const activeDraggingCardId = ActiveDraggingCardId
            const activeDraggingCardData = ActiveDraggingCardData
            const overCardId = OverCardId
            const activeColumn = ActiveColumn
            const overColumn = OverColumn

            // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
            if (!activeColumn || !overColumn) return

            // Hành động kéo thả card giữa 2 column khác nhau
            // Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật một lần rồi.
            if (OldColumnWhenDragCard.id !== overColumn.id) {
                moveCardBetweenDifferentColumns(
                    // overColumn,
                    // overCardId,
                    // active,
                    // over,
                    // activeColumn,
                    // activeDraggingCardId,
                    // activeDraggingCardData,
                    true
                )
            }
            if (!IsMoveCardBetweenDifferentColumns) {
                // Hành động kéo thả card trong cùng một cái column

                // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
                const oldCardIndex = OldColumnWhenDragCard?.cards?.findIndex((c: Card) => c.id === CurrentDragItemId)
                // Lấy vị trí mới (từ thằng overColumn)
                const newCardIndex = overColumn?.cards?.findIndex((c: Card) => c.id === overCardId)

                // Dùng arrayMove vì kéo card trong một cái column thì tương tự với logic kéo column trong một cái board content
                const dndOrderedCards: Card[] = arrayMove(OldColumnWhenDragCard?.cards, oldCardIndex, newCardIndex)
                const dndOrderedCardIds: string[] = dndOrderedCards.map((card: any) => card.id)

                // Vẫn gọi update State ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API (small trick)
                const nextColumns = cloneDeep(columns)

                // Tìm tới cái ColumnFC mà chúng ta đang thả
                const targetColumn = nextColumns.find(column => column.id === overColumn.id)

                // cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
                targetColumn.cards = dndOrderedCards
                targetColumn.cardOrderIds = dndOrderedCardIds

                dispatch(updateColum(nextColumns))

                if (stompClient) {
                    const req = {
                        cardId: activeDraggingCardId,
                        fromColumnId: OldColumnWhenDragCard.id,
                        toColumnId: OldColumnWhenDragCard.id,
                        cardOrderIds: dndOrderedCardIds
                    } as BoardCardMoveReq

                    console.log('Move Same col req:', req)

                    stompClient.publish({
                        destination: `/app/board/${boardId}/moveCard`,
                        body: JSON.stringify(req)
                    })
                }
                // call api here!!
            }
        }

        // Xử lý kéo thả Columns trong một cái boardContent
        if (ActiveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
            if (active.id !== over.id) {
                // Lấy vị trí cũ (từ thằng active)
                const oldColumnIndex = columns.findIndex(c => c.id === active.id)
                // Lấy vị trí mới (từ thằng over)
                const newColumnIndex = columns.findIndex(c => c.id === over.id)

                // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
                // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
                const dndOrderedColumns = arrayMove(columns, oldColumnIndex, newColumnIndex)

                dispatch(updateColumnOrder(dndOrderedColumns))

                if (stompClient) {
                    const req = {
                        columnOrderIds: dndOrderedColumns.map(column => column.id)
                    } as BoardColumnMoveReq

                    stompClient.publish({
                        destination: `/app/board/${boardId}/moveColumn`,
                        body: JSON.stringify(req)
                    })
                }
            }
        }

        // Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu

        // clean moveInfo
        moveInfo.active = null
        moveInfo.over = null
        moveInfo.activeColumn = null
        moveInfo.overColumn = null
        moveInfo.currentDragItemId = null
        moveInfo.currentDragItemData = null
        moveInfo.oldColumnWhenDragCard = null

        // setCurrentDragItemId(null)
        // setActiveDragItemType(null)
        // setCurrentDragItemData(null)
        // setOldColumnWhenDragCard(null)
    }
    //</editor-fold>

    //<editor-fold desc="Custom lib">
    /**
     * Animation khi thả (Drop) phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay (video 32)
     */
    const customDropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
    }

    // Chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns (video 37 fix bug quan trọng)
    const collisionDetectionStrategy = useCallback((args: any) => {
        // Trường hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
        if (ActiveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return closestCorners({ ...args })
        }

        // Tìm các điểm giao nhau, va chạm, trả về một mảng các va chạm - intersections với con trỏ
        const pointerIntersections = pointerWithin(args)
        // Video 37.1: Nếu pointerIntersections là mảng rỗng, return luôn không làm gì hết.
        // Fix triệt để cái bug flickering của thư viện Dnd-kit trong trường hợp sau:
        //  - Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
        if (!pointerIntersections?.length) return null
        // Tìm overId đầu tiên trong đám pointerIntersections ở trên
        let overId = getFirstCollision(pointerIntersections, 'id')
        if (overId) {
            // Video 37: Đoạn này để fix cái vụ flickering nhé.
            // Nếu cái over nó là column thì sẽ tìm tới cái cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở đây dùng closestCorners mình thấy mượt mà hơn.
            // Nếu không có đoạn checkColumn này thì bug flickering vẫn fix đc rồi nhưng mà kéo thả sẽ rất giật giật lag.
            const checkColumn = columns.find(column => column.id === overId)
            if (checkColumn) {
                // console.log('overId before: ', overId)
                overId = closestCorners({
                    ...args,
                    droppableContainers: args.droppableContainers.filter((container: any) => {
                        // console.log('overid:', overId)
                        return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
                    })
                })[0]?.id
                // console.log('overId after: ', overId)
            }

            lastOverId.current = overId
            return [{ id: overId }]
        }

        // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
        return lastOverId.current ? [{ id: lastOverId.current }] : []
    }, [ActiveDragItemType, board])
    //</editor-fold>

    return (
        <DndContext
            // Cảm biến (đã giải thích kỹ ở video số 30)
            sensors={sensors}
            // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua ColumnFC được vì lúc này nó đang bị conflict giữa card và column), chúng ta sẽ dùng closestCorners thay vì closestCenter
            // https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
            // Update video 37: nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu (vui lòng xem video 37 sẽ rõ)
            // collisionDetection={closestCorners}

            // Tự custom nâng cao thuật toán phát hiện va chạm (video fix bug số 37)
            collisionDetection={collisionDetectionStrategy}

            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box sx={{
                bgcolor: (theme: any) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                width: '100%',
                height: (theme: any) => theme.trello.boardContentHeight,
                p: '10px 0'
            }}>
                <>
                    <ListColumnsFC
                        // columns={orderedColumns}
                        // createNewColumn={createNewColumn}
                        // createNewCard={createNewCard}
                        deleteColumnDetails={null}
                    />
                    <DragOverlay dropAnimation={customDropAnimation}>
                        {!ActiveDragItemType && null}
                        {(ActiveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) &&
                            <ColumnFC column={CurrentDragItemData} /*createNewCard={undefined}*/ deleteColumnDetails={undefined} />}
                        {(ActiveDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) &&
                            <CardFC card={CurrentDragItemData} modalRender={undefined} />}
                    </DragOverlay>
                </>
            </Box>
        </DndContext>
    )
}

export default BoardContentFC
