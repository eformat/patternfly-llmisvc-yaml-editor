// Single L4 deployment
export const MODEL_OPTIONS = [
  {
    id: 'example',
    label: 'Example (generic)',
    name: 'example',
    uri: 'oci://registry.redhat.io/example:latest',
    additionalArgs: '',
    validated: false
  },
  {
    id: 'qwen3-8b-fp8',
    label: 'RedHatAI / Qwen3-8B-FP8-dynamic',
    name: 'RedHatAI/Qwen3-8B-FP8-dynamic',
    uri: 'oci://registry.redhat.io/rhelai1/modelcar-qwen3-8b-fp8-dynamic:latest',
    additionalArgs: '--enable-auto-tool-choice --tool-call-parser=hermes',
    validated: true
  },
  {
    id: 'llama-4-scout-17b',
    label: 'RedHatAI / Llama-4-Scout-17B-16E-instruct-FP8-dynamic',
    name: 'RedHatAI/Llama-4-Scout-17B-16E-instruct-FP8-dynamic',
    uri: 'oci://registry.redhat.io/rhelai1/modelcar-llama-4-scout-17b-16e-instruct-fp8-dynamic:latest',
    additionalArgs: '--enable-auto-tool-choice --tool-call-parser=llama3',
    validated: false
  },
  {
    id: 'gemma-3n-E4B-it-FP8-dynamic',
    label: 'Google / Gemma-3n-E4B-it-FP8-dynamic',
    name: 'google/gemma-3n-E4B-it',
    uri: 'oci://quay.io/eformat/modelcar-gemma-3n-e4b-it-fp8-dynamic:1.5',
    additionalArgs:
      '--gpu_memory_utilization 0.80 --enable-auto-tool-choice --tool-call-parser pythonic --chat-template /mnt/models/tool_chat_template_gemma3_pythonic.jinja',
    validated: true
  },
  {
    id: 'granite-3.1-8b-instruct',
    label: 'IBM / Granite-3.1-8B-Instruct',
    name: 'ibm/granite-3.1-8b-instruct',
    uri: 'oci://registry.redhat.io/rhelai1/modelcar-granite-3-1-8b-instruct:1.5',
    additionalArgs:
      '--max-model-len=25000 --enable-auto-tool-choice --tool-call-parser=granite',
    validated: false
  },
  {
    id: 'llama-3.2-3b-instruct',
    label: 'RedHatAI / Llama-3.2-3B-Instruct',
    name: 'RedHatAI/llama-3.2-3b-instruct',
    uri: 'oci://quay.io/redhat-ai-services/modelcar-catalog:llama-3.2-3b-instruct',
    additionalArgs:
      '--max-model-len=110000 --enable-auto-tool-choice --tool-call-parser=llama3_json',
    validated: true
  }
];
