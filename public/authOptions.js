export const AUTH_OPTIONS = [
  {
    id: 'secure',
    yaml: `---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: example-sa
---
apiVersion: v1
kind: Secret
metadata:
  name: example-sa-example-sa
  namespace: llama-serving
  annotations:
    kubernetes.io/service-account.name: "example-sa"
    openshift.io/display-name: example-sa
  labels:
    opendatahub.io/dashboard: "true"
type: kubernetes.io/service-account-token
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  labels:
    opendatahub.io/dashboard: "true"
  name: example-view-role
  namespace: llama-serving
rules:
- apiGroups:
  - serving.kserve.io
  resourceNames:
  - example
  resources:
  - llminferenceservices
  verbs:
  - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  labels:
    opendatahub.io/dashboard: "true"
  name: example-view
  namespace: llama-serving
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: example-view-role
subjects:
- kind: ServiceAccount
  name: example-sa
`
  },
];