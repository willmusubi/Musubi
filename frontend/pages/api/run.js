async function getTestReuslt(judgeId, epochKey, commitment) {
  return new Promise(async (resolve) => {
    const timer = setInterval(async () => {
      const resultStream = await fetch(
        'http://localhost:1234/outer/api/result',
        {
          method: 'POST',
          headers: {
            authorization: 'Basic edc1ad3076d24de6aff6fd4fe3d870cc',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            trace_id: '2ad1131c-309b-4507-97c9-3c91f1588cdf',
            version: 'UNKNOWN_VERSION',
            data: {
              judgeId,
              epochKey, 
              commitment
            },
          }),
        }
      );

      const data = await resultStream.json();
      console.log(data);

      if (data?.err_code === 0 && data?.data?.status === 'completed') {
        clearInterval(timer);
        resolve(data?.data);
      }
    }, 3000);
  });
}

export default async function handler(req, res) {
  const { code, questionId, epochKey, commitment } = req.query;
  const runJob = await fetch('http://localhost:1234/outer/api/run', {
    method: 'POST',
    headers: {
      authorization: 'Basic edc1ad3076d24de6aff6fd4fe3d870cc',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      trace_id: '2ad1131c-309b-4507-97c9-3c91f1588cdf',
      version: 'UNKNOWN_VERSION',
      data: {
        code,
        questionId,
      },
    }),
  });

  const runJobData = await runJob.json();

  const judgerId = runJobData?.data?.judgeId;

  const result = await getTestReuslt(judgerId, epochKey, commitment);

  console.log(result);

  res.status(200).json({
    ...result,
  });
}
