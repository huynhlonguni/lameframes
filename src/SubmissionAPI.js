import axios from "axios";

export const SubmissionLogin = async (username, password) => {
	return axios.post('https://eventretrieval.one/api/v2/login', {
		username: username,
		password: password
	});
}

export const SubmissionGetEvaluationID = async (sessionid) => {
	return axios.get('https://eventretrieval.one/api/v2/client/evaluation/list', {
		params: {
			session: sessionid
		}
	});
}

export const SubmissionSubmitQA = async (sessionid, evaluationId, qa, video, frame_ms) => {
	return axios.post(`https://eventretrieval.one/api/v2/submit/${evaluationId}?session=${sessionid}`, {
		answerSets: [
			{
				answers: [
					{
						text: `${qa}-${video}-${frame_ms}`
					}
				]
			}
		]
	});
}

export const SubmissionSubmitKIS = async (sessionid, evaluationId, video, frame_ms) => {
	return axios.post(`https://eventretrieval.one/api/v2/submit/${evaluationId}?session=${sessionid}`, {
		answerSets: [
			{
				answers: [
					{
						mediaItemName: video,
						start: frame_ms,
						end: frame_ms
					}
				]
			}
		]
	});
}