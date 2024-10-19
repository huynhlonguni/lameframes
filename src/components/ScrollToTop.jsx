import { useEffect, useRef } from "react";

const ScrollToTop = ({children, className}) => {
	const ref = useRef();

	useEffect(() => {
		ref.current.scrollTo(0, 0);
	}, [children]);

	return(
		<div className={className} ref={ref}>
			{children}
		</div>
	)
}

export default ScrollToTop;