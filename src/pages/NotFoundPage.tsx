import { Link } from 'react-router-dom';
import { InteractiveHoverButton } from '../components/InteractiveHoverButton';

export default function NotFoundPage() {
	return (
		<div className="relative z-10 flex items-center justify-center min-h-[70vh] px-6">
			<div className="text-center">
				<h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
					404
				</h1>
				<p className="text-xl md:text-2xl text-white/80 mb-8">Not found</p>
				<Link to="/">
					<InteractiveHoverButton className="px-8 py-4">
						Return to Home
					</InteractiveHoverButton>
				</Link>
			</div>
		</div>
	);
}


