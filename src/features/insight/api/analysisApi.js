const FASTAPI_URL = import.meta.env.VITE_FASTAPI_BASE_URL || 'http://127.0.0.1:8000/api';

async function readResponseText(response) {
    try {
        return await response.text();
    } catch {
        return '';
    }
}

export async function fetchLatestAnalysisData() {
    const storedTaskId = localStorage.getItem('analysisTaskId');
    let response = null;

    if (storedTaskId) {
        response = await fetch(`${FASTAPI_URL}/analysis/result/${storedTaskId}`);

        if (!response.ok && response.status !== 400 && response.status !== 404) {
            const detail = await readResponseText(response);
            throw new Error(`분석 결과를 불러오지 못했습니다. (${response.status}) ${detail}`.trim());
        }
    }

    if (!response || !response.ok) {
        response = await fetch(`${FASTAPI_URL}/analysis/latest`);
    }

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('아직 분석 결과가 없습니다. 회원가입 후 리뷰 수집과 분석이 완료되면 표시됩니다.');
        }

        const detail = await readResponseText(response);
        throw new Error(`분석 결과를 불러오지 못했습니다. (${response.status}) ${detail}`.trim());
    }

    return response.json();
}
