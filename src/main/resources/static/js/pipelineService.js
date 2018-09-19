let PipelineService = function (jquery, as) {

    // If no AjaxSequencer was passed in, use the jQuery instance directly.
    as = as || jquery;

    let getPipelines = function (responseHandler) {
        as.get('/pipelines', function (response) {
              const listOfPipelineNames = [];
              for (let i = 0; i < response.length; i++) {
                  listOfPipelineNames.push(response[i].name);
              }
              responseHandler(listOfPipelineNames);
        });
    },
        getPipelineDetailFromAWS = function (pipelineName, responseHandler) {
            as.get("/pipeline/" + pipelineName, function(response) {
                    responseHandler(response);
            });
        },
        parsePipelineState = function (stageState, commitMessage) {
            const currentRevision = stageState.actionStates[0].currentRevision || {};
            const latestExecution = stageState.actionStates[0].latestExecution || {};
            const status = latestExecution.status || '';
            const errorDetails = latestExecution.errorDetails || {};
            return {
                name: stageState.stageName,
                revisionId: currentRevision.revisionId,
                latestStatus: status.toLowerCase(),
                lastStatusChange: latestExecution.lastStatusChange,
                externalExecutionUrl: latestExecution.externalExecutionUrl,
                errorDetails: errorDetails.message,
                commitMessage: commitMessage
            };
        },
        getPipelineDetails = function (pipelineName, responseHandler) {
            let stages = [];
            getPipelineDetailFromAWS(pipelineName,
                function (response) {
                    for (let i = 0; i < response.stageStates.length; i++) {
                        stages.push(parsePipelineState(response.stageStates[i], response.commitMessage));
                    }
                    responseHandler(stages);
                });
        };

    return {
        getPipelines: getPipelines,
        getPipelineDetails: getPipelineDetails,
    };
};

