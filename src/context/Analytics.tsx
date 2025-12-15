import { v4 as uuidv4 } from 'uuid';


const ANALYTICS_ROUTE = '/.netlify/functions/analytics';

class Analytics {

	private sessionId: string;
	private userId: string | null = null;

	constructor() {
		this.sessionId = this.getOrCreateSessionId();
	}

	private getOrCreateSessionId(): string {
		let stored = localStorage.getItem('analytics_session_id');
		if (stored) return stored;

		const newId = uuidv4();
		localStorage.setItem('analytics_session_id', newId);
		return newId;
	}

	setUserId(userId: string) {
		this.userId = userId;
	}

	private getDeviceInfo() {
		const ua = navigator.userAgent;

		return {
			userAgent: ua,
			browser: this.getBrowser(ua),
			os: this.getOS(ua),
			device: this.getDevice(ua),
			screenSize: `${window.screen.width}x${window.screen.height}`,
			viewport: `${window.innerWidth}x${window.innerHeight}`,
			language: navigator.language,
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			source: document.referrer || 'direct'
		};
	}

	private getBrowser(ua: string): string {
		if (ua.includes('Firefox/')) return 'Firefox';
		if (ua.includes('Edg/')) return 'Edge';
		if (ua.includes('Chrome/')) return 'Chrome';
		if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
		if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera';
		return 'Unknown';
	}

	private getOS(ua: string): string {
		if (ua.includes('Windows')) return 'Windows';
		if (ua.includes('Mac OS')) return 'macOS';
		if (ua.includes('Linux')) return 'Linux';
		if (ua.includes('Android')) return 'Android';
		if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
		return 'Unknown';
	}

	private getDevice(ua: string): string {
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			return 'Tablet';
		}
		if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
			return 'Mobile';
		}
		return 'Desktop';
	}

	track(event: string, properties: Record<string, any> = {}) {
		// send action report
		fetch(ANALYTICS_ROUTE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'track_event',
				event,
				sessionId: this.sessionId,
				properties
			}),
		});
	}


	sessionMetadata() {
		let metadata = this.getDeviceInfo();

		fetch(ANALYTICS_ROUTE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'session_metadata',
				sessionId: this.sessionId,
				metadata,
			}),
		});
	}

	pageview() {
		this.track('pageview', {
			path: window.location.pathname,
			title: document.title
		});
	}

}


export const analytics = new Analytics();
