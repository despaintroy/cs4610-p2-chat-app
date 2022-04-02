import {
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormHelperText,
	Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { FC, useState } from 'react'
import SendIcon from '@mui/icons-material/Send'

export interface SendMessageProps {
	sendMessage: (message: string) => void
	placeholder?: string
}

const SendMessage: FC<SendMessageProps> = ({
	sendMessage,
	placeholder = 'Type a message...',
}) => {
	const [messageDraft, setMessageDraft] = useState('')

	const handleSend = (): void => {
		if (!messageDraft) return
		sendMessage(messageDraft)
		setMessageDraft('')
	}

	return (
		<Box sx={{ px: 2, pb: 3, bgcolor: '#37393e' }}>
			<OutlinedInput
				multiline
				fullWidth
				autoFocus
				placeholder={placeholder}
				size='small'
				autoComplete='off'
				value={messageDraft}
				onChange={(e): void => setMessageDraft(e.target.value)}
				onKeyDown={(e): void => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault()
						handleSend()
					}
				}}
				endAdornment={
					<InputAdornment position='end'>
						<IconButton
							edge='end'
							onClick={handleSend}
							disabled={!messageDraft}
						>
							<SendIcon />
						</IconButton>
					</InputAdornment>
				}
				sx={{ bgcolor: '#41444A' }}
			/>
			<FormHelperText>
				<Typography variant='caption' color='text.disabled'>
					Press <b>Enter</b> to send, <b>Shift + Enter</b> for new line
				</Typography>
			</FormHelperText>
		</Box>
	)
}

export default SendMessage
