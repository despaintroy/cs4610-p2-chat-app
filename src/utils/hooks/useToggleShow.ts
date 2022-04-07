import { useState } from 'react'

export default function useToggleShow(initialState: boolean): [
	show: boolean,
	actions: {
		toggle: () => void
		setShow: (show: boolean) => void
		show: () => void
		hide: () => void
	}
] {
	const [isShow, setShow] = useState(initialState)

	const toggle = (): void => setShow(!isShow)
	const show = (): void => setShow(true)
	const hide = (): void => setShow(false)

	return [isShow, { toggle, setShow, show, hide }]
}
