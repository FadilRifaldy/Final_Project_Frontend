import { useState, useEffect } from 'react';

export function useProgressBar(loading: boolean): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (loading) {
            setProgress(0);
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress >= 90) {
                        clearInterval(timer);
                        return 90;
                    }
                    const diff = Math.random() * 10;
                    return Math.min(oldProgress + diff, 90);
                });
            }, 200);

            return () => clearInterval(timer);
        } else {
            setProgress(100);
            const timer = setTimeout(() => setProgress(0), 500);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    return progress;
}
