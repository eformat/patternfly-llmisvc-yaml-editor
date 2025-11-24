const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const inferenceServices = [
  {
    id: 'isvc-demo',
    label: 'InferenceService',
    description: 'InferenceService rendered in the YAML editor',
    metadata: {
      name: 'example',
      namespace: 'demo-llm'
    },
    yaml: `apiVersion: serving.kserve.io/v1alpha1
kind: InferenceService
metadata:
  name: example
  annotations:
    openshift.io/display-name: example
    opendatahub.io/hardware-profile-name: small-gpu
    opendatahub.io/hardware-profile-namespace: redhat-ods-applications
    opendatahub.io/model-type: generative
    serving.knative.openshift.io/enablePassthrough: "true"
    serving.kserve.io/deploymentMode: RawDeployment
    sidecar.istio.io/inject: "false"
    sidecar.istio.io/rewriteAppHTTPProbers: "true"
    security.opendatahub.io/enable-auth: "false"
  labels:
    app.kubernetes.io/component: inference
    app.kubernetes.io/instance: example
    app.kubernetes.io/name: example
    opendatahub.io/dashboard: "true"
    opendatahub.io/genai-asset: "true"
    kueue.x-k8s.io/queue-name: default
`
  },
  {
    id: 'llm-demo',
    label: 'LLMInferenceService',
    description: 'LLMInferenceService rendered in the YAML editor',
    metadata: {
      name: 'example',
      namespace: 'demo-llm'
    },
    yaml: `apiVersion: serving.kserve.io/v1alpha1
kind: LLMInferenceService
metadata:
  name: example
  annotations:
    openshift.io/display-name: example
    opendatahub.io/hardware-profile-name: small-gpu
    opendatahub.io/hardware-profile-namespace: redhat-ods-applications
    opendatahub.io/model-type: generative
    security.opendatahub.io/enable-auth: "false"
  labels:
    app.kubernetes.io/component: llminference
    app.kubernetes.io/instance: example
    app.kubernetes.io/name: example
    opendatahub.io/dashboard: "true"
    opendatahub.io/genai-asset: "true"
    kueue.x-k8s.io/queue-name: default
`
  }
];

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/patternfly',
  express.static(path.join(__dirname, 'node_modules', '@patternfly', 'patternfly'))
);

app.get('/api/inference-services', (_, res) => {
  res.json(inferenceServices);
});

app.listen(PORT, () => {
  console.log(`PatternFly YAML editor listening on http://localhost:${PORT}`);
});

