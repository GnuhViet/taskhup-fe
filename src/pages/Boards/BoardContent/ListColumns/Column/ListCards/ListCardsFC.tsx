import React from 'react'
import Box from '@mui/material/Box'
import CardFC from './Card/CardFC'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from '~/core/model/card.model'

interface ListCardsFCProps {
    cards: Card[]
}

const ListCardsFC: React.FC<ListCardsFCProps> = ({ cards }) => {
    return (
        <SortableContext items={cards?.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <Box sx={{
                p: '5px 5px 5px 5px',
                m: '0 5px',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflowX: 'hidden',
                overflowY: 'auto',
                maxHeight: (theme: any) => `calc(
                  ${theme.trello.boardContentHeight} -
                  ${theme.spacing(5)} -
                  ${theme.trello.columnHeaderHeight} -
                  126px
                )`,
                // maxHeight: (theme: any) => `calc(
                //     ${theme.trello.boardContentHeight} -
                //     ${theme.spacing(5)} -
                //     ${theme.trello.columnHeaderHeight} -
                //     ${theme.trello.columnFooterHeight}
                //   )`,
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
            }}>
                {cards?.map(card =>
                    <CardFC
                        key={card.id}
                        card={card}
                    />)
                }
            </Box>
        </SortableContext>
    )
}

export default ListCardsFC
