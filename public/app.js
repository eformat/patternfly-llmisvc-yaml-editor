import { parse as parseYaml, stringify as stringifyYaml } from 'https://cdn.jsdelivr.net/npm/yaml@2.5.1/+esm';
import { MODEL_OPTIONS } from './modelOptions.js';
import { INFERENCE_SERVICES } from './inferenceServices.js';
import { AUTH_OPTIONS } from './authOptions.js';

function isLLMKind(kind) {
  return typeof kind === 'string' && kind.toLowerCase().includes('llminferenceservice');
}

function renderModelOptions() {
  if (!elements.modelSelect) {
    return;
  }
  const fragment = document.createDocumentFragment();
  MODEL_OPTIONS.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.id;
    opt.textContent = option.label;
    fragment.appendChild(opt);
  });
  elements.modelSelect.appendChild(fragment);
}

function setModelControlVisibility(isVisible) {
  if (elements.modelControl) {
    elements.modelControl.hidden = !isVisible;
    elements.modelControl.style.display = isVisible ? '' : 'none';
  }
  if (elements.modelValidationBadge) {
    elements.modelValidationBadge.hidden = !isVisible;
    if (!isVisible) {
      elements.modelValidationBadge.classList.remove('pf-m-green', 'pf-m-red', 'pf-m-purple');
      const textNode = elements.modelValidationBadge.querySelector('.pf-v6-c-label__content');
      if (textNode) {
        textNode.textContent = '';
      }
      elements.modelValidationBadge.removeAttribute('aria-label');
    }
  }
  if (!isVisible && elements.modelSelect) {
    elements.modelSelect.value = '';
  }
}

function updateModelValidationBadge(option) {
  if (!elements.modelValidationBadge) {
    return;
  }

  const badge = elements.modelValidationBadge;
  const textNode = badge.querySelector('.pf-v6-c-label__content');
  badge.classList.remove('pf-m-green', 'pf-m-red', 'pf-m-purple');

  if (!option) {
    badge.hidden = true;
    if (textNode) {
      textNode.textContent = '';
    }
    badge.removeAttribute('aria-label');
    return;
  }

  badge.hidden = false;
  const isValidated = Boolean(option.validated);
  badge.classList.add(isValidated ? 'pf-m-green' : 'pf-m-red');
  if (textNode) {
    textNode.textContent = 'Valid';
  }
  badge.setAttribute('aria-label', isValidated ? 'Model validated' : 'Model not validated');
}

function setResourceControlVisibility(isVisible) {
  if (elements.llmResourceControls) {
    elements.llmResourceControls.hidden = !isVisible;
    elements.llmResourceControls.style.display = isVisible ? '' : 'none';
  }
  if (!isVisible) {
    state.resources = getDefaultResourceState();
    updateResourceInputs();
  }
}

function setToolControlVisibility(isVisible) {
  if (elements.toolControl) {
    elements.toolControl.hidden = !isVisible;
    elements.toolControl.style.display = isVisible ? '' : 'none';
  }
  if (!isVisible) {
    state.toolCallingEnabled = false;
  }
  updateToolRadios();
}

function setAuthControlVisibility(isVisible) {
  if (elements.authControl) {
    elements.authControl.hidden = !isVisible;
    elements.authControl.style.display = isVisible ? '' : 'none';
  }
  if (!isVisible) {
    state.authEnabled = false;
  }
  updateAuthRadios();
}

function setSmartSchedulingControlVisibility(isVisible) {
  if (elements.smartSchedulingControl) {
    elements.smartSchedulingControl.hidden = !isVisible;
    elements.smartSchedulingControl.style.display = isVisible ? '' : 'none';
  }
  if (!isVisible) {
    state.smartSchedulingEnabled = false;
  }
  updateSmartSchedulingRadios();
}

function setMaaSControlVisibility(isVisible) {
  if (elements.maasControl) {
    elements.maasControl.hidden = !isVisible;
    elements.maasControl.style.display = isVisible ? '' : 'none';
  }
  if (!isVisible) {
    state.maasEnabled = false;
  }
  updateMaaSRadios();
}

function updateResourceInputs(type) {
  if (!elements.resourceInputs?.length) {
    return;
  }
  const applyValue = (input) => {
    const resourceType = input.dataset.resourceInput;
    if (!resourceType) {
      return;
    }
    const value = state.resources?.[resourceType];
    if (Number.isFinite(value)) {
      input.value = value;
    }
  };
  if (type) {
    elements.resourceInputs.forEach((input) => {
      if (input.dataset.resourceInput === type) {
        applyValue(input);
      }
    });
  } else {
    elements.resourceInputs.forEach(applyValue);
  }
}

function updateToolRadios() {
  if (!elements.toolRadios?.length) {
    return;
  }
  elements.toolRadios.forEach((radio) => {
    if (radio.value === 'on') {
      radio.checked = state.toolCallingEnabled;
    } else if (radio.value === 'off') {
      radio.checked = !state.toolCallingEnabled;
    }
    radio.disabled = !state.isLLMActive;
  });
}

function updateAuthRadios() {
  if (!elements.authRadios?.length) {
    return;
  }
  elements.authRadios.forEach((radio) => {
    if (radio.value === 'on') {
      radio.checked = state.authEnabled;
    } else if (radio.value === 'off') {
      radio.checked = !state.authEnabled;
    }
    radio.disabled = !state.isLLMActive;
  });
}

function updateSmartSchedulingRadios() {
  if (!elements.smartSchedulingRadios?.length) {
    return;
  }
  elements.smartSchedulingRadios.forEach((radio) => {
    if (radio.value === 'on') {
      radio.checked = state.smartSchedulingEnabled;
    } else if (radio.value === 'off') {
      radio.checked = !state.smartSchedulingEnabled;
    }
    radio.disabled = !state.isLLMActive;
  });
}

function updateMaaSRadios() {
  if (!elements.maasRadios?.length) {
    return;
  }
  elements.maasRadios.forEach((radio) => {
    if (radio.value === 'on') {
      radio.checked = state.maasEnabled;
    } else if (radio.value === 'off') {
      radio.checked = !state.maasEnabled;
    }
    radio.disabled = !state.isLLMActive;
  });
}

function findModelOptionById(id) {
  return MODEL_OPTIONS.find((option) => option.id === id);
}

function findModelOptionByModel(model) {
  if (!model) {
    return undefined;
  }
  return (
    MODEL_OPTIONS.find((option) => option.uri === model.uri) ??
    MODEL_OPTIONS.find((option) => option.name === model.name)
  );
}

function getModelFromYaml(yamlContent) {
  const doc = parseYamlDocument(yamlContent);
  if (!doc?.spec?.model) {
    return undefined;
  }
  const { uri, name } = doc.spec.model;
  if (!uri && !name) {
    return undefined;
  }
  return {
    uri: typeof uri === 'string' ? uri : undefined,
    name: typeof name === 'string' ? name : undefined
  };
}

function syncModelSelectionFromYaml(yamlContent, isLLM) {
  if (!elements.modelSelect) {
    return;
  }
  if (!isLLM) {
    state.modelSelection = '';
    elements.modelSelect.value = '';
    updateModelValidationBadge(undefined);
    return;
  }
  const derivedModel = getModelFromYaml(yamlContent);
  const matched = findModelOptionByModel(derivedModel);
  if (matched) {
    applyModelSelection(matched.id, { skipEditorUpdate: true });
  } else {
    state.modelSelection = '';
    elements.modelSelect.value = '';
    updateModelValidationBadge(undefined);
  }
}

function applyModelSelection(modelId, { skipEditorUpdate = false } = {}) {
  if (!state.isLLMActive) {
    state.modelSelection = '';
    if (elements.modelSelect) {
      elements.modelSelect.value = '';
    }
    return;
  }

  const option = findModelOptionById(modelId);
  if (!option) {
    state.modelSelection = '';
    if (elements.modelSelect) {
      elements.modelSelect.value = '';
    }
    updateModelValidationBadge(undefined);
    return;
  }

  state.modelSelection = option.id;
  if (elements.modelSelect && elements.modelSelect.value !== option.id) {
    elements.modelSelect.value = option.id;
  }
  updateModelValidationBadge(option);

  if (skipEditorUpdate || !state.editor) {
    return;
  }

  const currentValue = state.editor.getValue();
  const updated = updateYamlDocument(currentValue, (doc) => {
    const spec = ensureNestedObject(doc, 'spec');
    if (state.isLLMActive) {
      ensureLLMRouterStructure(spec);
      ensureLLMTemplateStructure(spec);
    }
    spec.model = {
      uri: option.uri,
      name: option.name
    };
    if (state.isLLMActive && state.toolCallingEnabled) {
      setAdditionalArgsValue(doc, option.additionalArgs ?? '');
    } else if (state.isLLMActive && !state.toolCallingEnabled) {
      setAdditionalArgsValue(doc, '');
    }
  });

  if (updated !== currentValue) {
    state.editor.setValue(updated.trimEnd() + '\n');
    updateEditorHeight();
  }
}

function handleModelChange(event) {
  applyModelSelection(event.target.value);
}
const DEFAULT_SERVICE_ID = 'llm-demo';

const elements = {
  select: document.getElementById('inferenceServiceSelect'),
  description: document.getElementById('resourceDescription'),
  badge: document.getElementById('resourceBadge'),
  editorTitle: document.getElementById('editorTitle'),
  nameInput: document.getElementById('resourceNameInput'),
  modelControl: document.getElementById('modelControl'),
  modelSelect: document.getElementById('modelSelect'),
  modelValidationBadge: document.getElementById('modelValidationBadge'),
  llmResourceControls: document.getElementById('llmResourceControls'),
  resourceInputs: document.querySelectorAll('[data-resource-input]'),
  resourceControls: document.querySelectorAll('[data-resource-control]'),
  toolControl: document.getElementById('toolControl'),
  toolRadios: document.querySelectorAll('input[name="toolCalling"]'),
  authControl: document.getElementById('authControl'),
  authRadios: document.querySelectorAll('input[name="authEnabled"]'),
  smartSchedulingControl: document.getElementById('smartSchedulingControl'),
  smartSchedulingRadios: document.querySelectorAll('input[name="smartScheduling"]'),
  maasControl: document.getElementById('maasControl'),
  maasRadios: document.querySelectorAll('input[name="maasEnabled"]'),
  editorHost: document.getElementById('editor'),
  copyButton: document.getElementById('copyButton'),
  copyStatus: document.getElementById('copyStatus'),
  copyStatusWrapper: document.getElementById('copyStatusWrapper'),
  shortcutsToggle: document.getElementById('shortcutsToggle'),
  shortcutsPanel: document.getElementById('shortcutsPanel'),
  replicaInput: document.getElementById('replicaInput'),
  replicaControls: document.querySelectorAll('[data-replica-control]')
};

const MIN_EDITOR_HEIGHT = 420;
let currentEditorHeight = MIN_EDITOR_HEIGHT;
const HAS_YAML = Boolean(parseYaml) && Boolean(stringifyYaml);
const DISPLAY_NAME_ANNOTATION = 'openshift.io/display-name';
const INSTANCE_LABEL = 'app.kubernetes.io/instance';
const NAME_LABEL = 'app.kubernetes.io/name';
const TOOL_ARGS_ENV = 'VLLM_ADDITIONAL_ARGS';
const LLM_ROUTER_BASE_KEYS = ['route', 'gateway'];
const AUTH_ANNOTATION = 'security.opendatahub.io/enable-auth';
const AUTH_SECTION_START = '# AUTH-RESOURCES-START';
const AUTH_SECTION_END = '# AUTH-RESOURCES-END';
const LLM_RESOURCE_DEFAULTS = Object.freeze({ cpu: 1, memory: 8, gpu: 1 });
const RESOURCE_FIELDS = {
  cpu: { resourceKey: 'cpu', unit: '', min: 0.1, step: 0.1, decimals: 1 },
  memory: { resourceKey: 'memory', unit: 'Gi', min: 1, step: 1, decimals: 0 },
  gpu: { resourceKey: 'nvidia.com/gpu', unit: '', min: 0, step: 1, decimals: 0 }
};

const state = {
  services: [],
  editor: null,
  current: null,
  replicaCount: 1,
  resourceName: 'example',
  resourceKind: 'InferenceService',
  isLLMActive: false,
  modelSelection: '',
  resources: { ...LLM_RESOURCE_DEFAULTS },
  toolCallingEnabled: false,
  authEnabled: false,
  smartSchedulingEnabled: false,
  maasEnabled: false
};

let resolveEditorReady;
const editorReady = new Promise((resolve) => {
  resolveEditorReady = resolve;
});

const MONACO_VERSION = '0.52.0';
const MONACO_BASE = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min`;

function initializeMonaco() {
  const amdRequire = window.require;
  if (!amdRequire) {
    console.error('Monaco AMD loader is not available.');
    return;
  }

  window.MonacoEnvironment = {
    getWorkerUrl() {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = { baseUrl: '${MONACO_BASE}/' };
        importScripts('${MONACO_BASE}/vs/base/worker/workerMain.js');
      `)}`;
    }
  };

  amdRequire.config({ paths: { vs: `${MONACO_BASE}/vs` } });
  amdRequire(['vs/editor/editor.main'], () => {
    state.editor = monaco.editor.create(document.getElementById('editor'), {
      language: 'yaml',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      roundedSelection: false,
      theme: 'vs',
      fontSize: 14,
      value: '# Select an InferenceService to view its YAML\n'
    });
    state.editor.onDidContentSizeChange(updateEditorHeight);
    window.addEventListener('resize', updateEditorHeight);
    updateEditorHeight();
    resolveEditorReady();
  });
}

function updateEditorHeight() {
  if (!state.editor || !elements.editorHost) {
    return;
  }

  const contentHeight =
    typeof state.editor.getContentHeight === 'function'
      ? state.editor.getContentHeight()
      : MIN_EDITOR_HEIGHT;
  const nextHeight = Math.max(MIN_EDITOR_HEIGHT, Math.ceil(contentHeight));

  if (Math.abs(nextHeight - currentEditorHeight) < 1) {
    return;
  }

  currentEditorHeight = nextHeight;
  elements.editorHost.style.height = `${nextHeight}px`;
  state.editor.layout();
}

async function initializeInferenceServices() {
  state.services = INFERENCE_SERVICES.map((service) => ({ ...service }));
  renderSelect();

  if (state.services.length > 0) {
    const defaultService =
      state.services.find((service) => service.id === DEFAULT_SERVICE_ID) ?? state.services[0];
    elements.select.value = defaultService.id;
    await editorReady;
    setActiveService(defaultService.id);
  } else {
    elements.description.textContent = 'No InferenceServices available yet.';
  }
}

function renderSelect() {
  elements.select.innerHTML = '';

  state.services.forEach((svc) => {
    const option = document.createElement('option');
    option.value = svc.id;
    option.textContent = svc.label ?? svc.id;
    elements.select.appendChild(option);
  });
}

function setActiveService(id) {
  const svc = state.services.find((service) => service.id === id);
  if (!svc) {
    return;
  }

  state.current = svc;

  elements.description.textContent = svc.description ?? '';
  elements.badge.querySelector('.pf-v6-c-label__content').textContent = svc.id;
  const displayKind = svc.kind ?? extractKindFromYaml(svc.yaml ?? '') ?? 'InferenceService';
  state.resourceKind = displayKind;
  state.isLLMActive = isLLMKind(displayKind);
  if (state.isLLMActive) {
    const initialDoc = parseYamlDocument(svc.yaml ?? '', { skipSplit: true });
    state.smartSchedulingEnabled = isSchedulerEnabled(initialDoc);
    state.maasEnabled = isMaaSEnabled(initialDoc);
  } else {
    state.smartSchedulingEnabled = false;
    state.maasEnabled = false;
  }
  setModelControlVisibility(state.isLLMActive);
  setResourceControlVisibility(state.isLLMActive);
  setToolControlVisibility(state.isLLMActive);
  setAuthControlVisibility(state.isLLMActive);
  setSmartSchedulingControlVisibility(state.isLLMActive);
  setMaaSControlVisibility(state.isLLMActive);
  const replicas = extractReplicaCount(svc.yaml ?? '');
  state.replicaCount = replicas;
  if (elements.replicaInput) {
    elements.replicaInput.value = String(replicas);
  }

  let activeYaml = svc.yaml ?? '';
  if (state.editor) {
    let normalizedYaml = ensureReplicaCount(svc.yaml ?? '', replicas);
    if (state.isLLMActive) {
      normalizedYaml = ensureLLMSpecBoilerplate(normalizedYaml);
    }
    activeYaml = normalizedYaml;
    state.editor.setValue(activeYaml.trimEnd() + '\n');
    updateEditorHeight();
    const derivedName = sanitizeResourceName(
      getMetadataNameFromYaml(normalizedYaml) ?? svc.metadata?.name ?? svc.id
    );
    applyResourceName(derivedName);
    state.editor.focus();
  } else {
    const fallbackName = sanitizeResourceName(svc.metadata?.name ?? svc.id);
    applyResourceName(fallbackName, { skipEditorUpdate: true });
  }

  syncModelSelectionFromYaml(activeYaml, state.isLLMActive);
  syncResourceStateFromYaml(activeYaml, state.isLLMActive);
  syncToolCallingFromYaml(activeYaml, state.isLLMActive);
  syncAuthEnabledFromYaml(activeYaml, state.isLLMActive);
  syncSmartSchedulingFromYaml(activeYaml, state.isLLMActive);
  syncMaaSFromYaml(activeYaml, state.isLLMActive);
}

async function handleCopy() {
  if (!state.editor) {
    return;
  }

  const yaml = state.editor.getValue();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(yaml);
    } else {
      legacyCopy(yaml);
    }
    showCopyStatus('Copied!');
  } catch (error) {
    console.error('Unable to copy YAML', error);
    showCopyStatus('Copy failed', true);
  }
}

function legacyCopy(content) {
  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

let copyStatusTimeout;
function showCopyStatus(message, isError = false) {
  clearTimeout(copyStatusTimeout);
  elements.copyStatus.textContent = message;
  const nextState = isError ? 'error' : 'success';
  if (elements.copyStatusWrapper) {
    elements.copyStatusWrapper.dataset.state = nextState;
  }

  copyStatusTimeout = setTimeout(() => {
    elements.copyStatus.textContent = '';
    if (elements.copyStatusWrapper) {
      elements.copyStatusWrapper.dataset.state = 'idle';
    }
  }, 2500);
}

const REPLICA_LINE_REGEX = /^(\s*)replicas:\s*(\d+)/m;
const SPEC_LINE_REGEX = /^spec:\s*$/m;
const KIND_LINE_REGEX = /^kind:\s*(.+)$/m;
const YAML_DUMP_OPTIONS = { lineWidth: 120, noRefs: true };

function parseYamlDocument(yamlContent, { skipSplit = false } = {}) {
  if (!HAS_YAML) {
    console.warn('YAML parser is not available; metadata editing is disabled.');
    return null;
  }
  try {
    const targetContent = skipSplit ? yamlContent ?? '' : splitAuthSection(yamlContent ?? '').base;
    const normalized = targetContent || '{}';
    const doc = parseYaml(normalized);
    return typeof doc === 'object' && doc !== null ? doc : {};
  } catch (error) {
    console.warn('Unable to parse YAML content', error);
    return null;
  }
}

function serializeYamlDocument(doc) {
  if (!HAS_YAML) {
    return null;
  }
  try {
    return stringifyYaml(doc, YAML_DUMP_OPTIONS);
  } catch (error) {
    console.warn('Unable to serialize YAML content', error);
    return null;
  }
}

function updateYamlDocument(yamlContent, mutator) {
  const { base, authSection } = splitAuthSection(yamlContent ?? '');
  const doc = parseYamlDocument(base, { skipSplit: true });
  if (!doc) {
    return yamlContent ?? '';
  }
  mutator(doc);
  const output = serializeYamlDocument(doc);
  if (!output) {
    return combineYamlWithAuth(base, authSection);
  }
  return combineYamlWithAuth(output, authSection);
}

function ensureNestedObject(target, key) {
  if (!target[key] || typeof target[key] !== 'object') {
    target[key] = {};
  }
  return target[key];
}

function getDefaultResourceState() {
  return { ...LLM_RESOURCE_DEFAULTS };
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function splitAuthSection(yamlContent = '') {
  const content = typeof yamlContent === 'string' ? yamlContent : '';
  const escapedStart = escapeForRegex(AUTH_SECTION_START);
  const escapedEnd = escapeForRegex(AUTH_SECTION_END);
  const regex = new RegExp(`(?:^|\\n)${escapedStart}[\\s\\S]*?${escapedEnd}\\s*`, 'm');
  const match = content.match(regex);
  if (!match) {
    return { base: content, authSection: '' };
  }
  const authSection = match[0].trim();
  const base = content.replace(regex, '').trimEnd();
  return { base: base ? `${base}\n` : '', authSection };
}

function combineYamlWithAuth(baseContent, authSection) {
  const trimmedBase = (baseContent ?? '').trimEnd();
  if (!authSection) {
    return trimmedBase ? `${trimmedBase}\n` : '';
  }
  const trimmedAuth = authSection.trim();
  const separator = trimmedBase ? '\n\n' : '';
  return `${trimmedBase}${separator}${trimmedAuth}\n`;
}

function buildAuthSection(resourceName) {
  const template = AUTH_OPTIONS[0]?.yaml;
  if (!template) {
    return '';
  }
  const safeName = sanitizeResourceName(resourceName) ?? 'example';
  const replaced = template.replace(/example/g, safeName);
  return `${AUTH_SECTION_START}\n${replaced.trim()}\n${AUTH_SECTION_END}`;
}

function appendAuthSection(yamlContent, resourceName) {
  const { base } = splitAuthSection(yamlContent);
  const section = buildAuthSection(resourceName);
  if (!section) {
    return combineYamlWithAuth(base, '');
  }
  return combineYamlWithAuth(base, section);
}

function removeAuthSection(yamlContent) {
  const { base } = splitAuthSection(yamlContent);
  return combineYamlWithAuth(base, '');
}

function formatResourceQuantity(type, value) {
  const def = RESOURCE_FIELDS[type];
  if (!def) {
    return value;
  }
  const decimals = def.decimals ?? 2;
  const numeric = Number.isFinite(value) ? value : def.min;
  const normalized =
    decimals === 0 ? Math.round(numeric) : Number(Math.max(def.min, numeric).toFixed(decimals));
  const asString = decimals === 0 ? String(normalized) : String(normalized).replace(/\.0+$/, '');
  return def.unit ? `${asString}${def.unit}` : asString;
}

function parseResourceQuantity(type, value) {
  if (value == null) {
    return undefined;
  }
  const def = RESOURCE_FIELDS[type];
  if (!def) {
    return undefined;
  }
  const stringValue = String(value).trim();
  const normalized = def.unit && stringValue.endsWith(def.unit)
    ? stringValue.slice(0, -def.unit.length)
    : stringValue;
  const parsed = parseFloat(normalized);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return Math.max(def.min, parsed);
}

function ensureLLMRouterStructure(spec, { includeScheduler } = {}) {
  const router = ensureNestedObject(spec, 'router');
  LLM_ROUTER_BASE_KEYS.forEach((key) => {
    if (!router[key] || typeof router[key] !== 'object') {
      router[key] = {};
    }
  });
  const shouldIncludeScheduler =
    includeScheduler !== undefined ? includeScheduler : state.smartSchedulingEnabled;
  if (shouldIncludeScheduler) {
    if (!router.scheduler || typeof router.scheduler !== 'object') {
      router.scheduler = {};
    }
  } else if (router.scheduler) {
    delete router.scheduler;
  }
  return router;
}

function ensureLLMTemplateStructure(spec) {
  const template = ensureNestedObject(spec, 'template');
  if (!Array.isArray(template.containers)) {
    if (Array.isArray(template.spec?.containers)) {
      template.containers = template.spec.containers;
      delete template.spec.containers;
      if (template.spec && Object.keys(template.spec).length === 0) {
        delete template.spec;
      }
    } else {
      template.containers = [];
    }
  }
  const containers = template.containers;
  let main = containers.find((container) => container?.name === 'main');
  if (!main) {
    main = containers.length ? containers[0] : { name: 'main' };
    if (!containers.length) {
      containers.push(main);
    }
  }
  if (!main.name) {
    main.name = 'main';
  }
  return { template, container: main };
}

function getExistingLLMContainer(doc) {
  const template = doc?.spec?.template;
  if (!template) {
    return undefined;
  }
  if (Array.isArray(template.containers)) {
    return template.containers.find((container) => container?.name === 'main') ?? template.containers[0];
  }
  if (Array.isArray(template.spec?.containers)) {
    return template.spec.containers.find((container) => container?.name === 'main') ?? template.spec.containers[0];
  }
  return undefined;
}

function extractResourceStateFromDoc(doc) {
  const container = getExistingLLMContainer(doc);
  if (!container?.resources) {
    return getDefaultResourceState();
  }
  const resources = container.resources;
  const requests = resources.requests ?? {};
  const limits = resources.limits ?? {};
  const result = {};
  Object.keys(RESOURCE_FIELDS).forEach((type) => {
    const def = RESOURCE_FIELDS[type];
    const sourceValue =
      requests[def.resourceKey] ??
      limits[def.resourceKey] ??
      (def.unit ? `${def.min}${def.unit}` : def.min);
    const parsed = parseResourceQuantity(type, sourceValue);
    result[type] = parsed ?? LLM_RESOURCE_DEFAULTS[type];
  });
  return result;
}

function ensureLLMSpecBoilerplate(yamlContent) {
  return updateYamlDocument(yamlContent, (doc) => {
    const spec = ensureNestedObject(doc, 'spec');
    ensureLLMRouterStructure(spec);
    const { container } = ensureLLMTemplateStructure(spec);
    const resources = ensureNestedObject(container, 'resources');
    const requests = ensureNestedObject(resources, 'requests');
    const limits = ensureNestedObject(resources, 'limits');
    const resourceState = state.resources ?? LLM_RESOURCE_DEFAULTS;
    Object.keys(RESOURCE_FIELDS).forEach((type) => {
      const def = RESOURCE_FIELDS[type];
      const formatted = formatResourceQuantity(type, resourceState[type] ?? LLM_RESOURCE_DEFAULTS[type]);
      requests[def.resourceKey] = formatted;
      limits[def.resourceKey] = formatted;
    });
  });
}

function applyResourceStateToYaml(yamlContent, resourcesState) {
  return updateYamlDocument(yamlContent, (doc) => {
    const spec = ensureNestedObject(doc, 'spec');
    const { container } = ensureLLMTemplateStructure(spec);
    const resources = ensureNestedObject(container, 'resources');
    const requests = ensureNestedObject(resources, 'requests');
    const limits = ensureNestedObject(resources, 'limits');
    Object.keys(RESOURCE_FIELDS).forEach((type) => {
      const def = RESOURCE_FIELDS[type];
      const formatted = formatResourceQuantity(type, resourcesState[type] ?? LLM_RESOURCE_DEFAULTS[type]);
      requests[def.resourceKey] = formatted;
      limits[def.resourceKey] = formatted;
    });
  });
}

function setAdditionalArgsValue(doc, value) {
  const spec = ensureNestedObject(doc, 'spec');
  const { container } = ensureLLMTemplateStructure(spec);
  if (!value) {
    if (Array.isArray(container.env)) {
      container.env = container.env.filter((envVar) => envVar?.name !== TOOL_ARGS_ENV);
    }
    return;
  }
  if (!Array.isArray(container.env)) {
    container.env = [];
  }
  const existing = container.env.find((envVar) => envVar?.name === TOOL_ARGS_ENV);
  if (existing) {
    existing.value = value;
  } else {
    container.env.push({ name: TOOL_ARGS_ENV, value });
  }
}

function getAdditionalArgsFromYaml(yamlContent) {
  const doc = parseYamlDocument(yamlContent);
  if (!doc) {
    return undefined;
  }
  const container = getExistingLLMContainer(doc);
  if (!Array.isArray(container?.env)) {
    return undefined;
  }
  const envVar = container.env.find((item) => item?.name === TOOL_ARGS_ENV);
  return envVar?.value;
}

function syncResourceStateFromYaml(yamlContent, isLLM) {
  if (!isLLM) {
    state.resources = getDefaultResourceState();
    updateResourceInputs();
    return;
  }
  const doc = parseYamlDocument(yamlContent);
  state.resources = doc ? extractResourceStateFromDoc(doc) : getDefaultResourceState();
  updateResourceInputs();
}

function syncToolCallingFromYaml(yamlContent, isLLM) {
  if (!isLLM) {
    state.toolCallingEnabled = false;
    updateToolRadios();
    return;
  }
  const args = getAdditionalArgsFromYaml(yamlContent);
  state.toolCallingEnabled = Boolean(args);
  updateToolRadios();
}

function syncAuthEnabledFromYaml(yamlContent, isLLM) {
  if (!isLLM) {
    state.authEnabled = false;
    updateAuthRadios();
    return;
  }
  const enabled = getAuthAnnotationFromYaml(yamlContent);
  state.authEnabled = Boolean(enabled);
  updateAuthRadios();
}

function syncSmartSchedulingFromYaml(yamlContent, isLLM) {
  if (!isLLM) {
    state.smartSchedulingEnabled = false;
    updateSmartSchedulingRadios();
    return;
  }
  const doc = parseYamlDocument(yamlContent);
  state.smartSchedulingEnabled = isSchedulerEnabled(doc);
  updateSmartSchedulingRadios();
}

function syncMaaSFromYaml(yamlContent, isLLM) {
  if (!isLLM) {
    state.maasEnabled = false;
    updateMaaSRadios();
    return;
  }
  const doc = parseYamlDocument(yamlContent);
  state.maasEnabled = isMaaSEnabled(doc);
  updateMaaSRadios();
}

function sanitizeResourceName(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  return trimmed || 'example';
}

function getMetadataNameFromYaml(yamlContent) {
  const doc = parseYamlDocument(yamlContent);
  if (!doc) {
    return undefined;
  }
  const metadata = doc.metadata;
  if (metadata && typeof metadata === 'object' && typeof metadata.name === 'string') {
    return metadata.name.trim();
  }
  return undefined;
}

function updateEditorTitle() {
  if (!elements.editorTitle) {
    return;
  }
  const kind = state.resourceKind ?? 'InferenceService';
  const name = state.resourceName ?? state.current?.metadata?.name ?? state.current?.id ?? 'example';
  elements.editorTitle.textContent = `${kind} : ${name}`;
}

function applyResourceName(newValue, { skipEditorUpdate = false } = {}) {
  const sanitized = sanitizeResourceName(newValue ?? state.resourceName);
  state.resourceName = sanitized;
  if (elements.nameInput && elements.nameInput.value !== sanitized) {
    elements.nameInput.value = sanitized;
  }

  if (skipEditorUpdate || !state.editor) {
    updateEditorTitle();
    return;
  }

  const currentValue = state.editor.getValue();
  const updated = updateYamlDocument(currentValue, (doc) => {
    const metadata = ensureNestedObject(doc, 'metadata');
    metadata.name = sanitized;
    const annotations = ensureNestedObject(metadata, 'annotations');
    annotations[DISPLAY_NAME_ANNOTATION] = sanitized;
    const labels = ensureNestedObject(metadata, 'labels');
    labels[INSTANCE_LABEL] = sanitized;
    labels[NAME_LABEL] = sanitized;
  });

  if (updated !== currentValue) {
    state.editor.setValue(updated.trimEnd() + '\n');
    updateEditorHeight();
  }
  if (state.authEnabled && state.isLLMActive && state.editor) {
    const withAuth = appendAuthSection(state.editor.getValue(), state.resourceName);
    if (withAuth.trimEnd() !== state.editor.getValue().trimEnd()) {
      state.editor.setValue(withAuth.trimEnd() + '\n');
      updateEditorHeight();
    }
  }
  updateEditorTitle();
}

function setAuthAnnotationValue(doc, enabled) {
  const metadata = ensureNestedObject(doc, 'metadata');
  const annotations = ensureNestedObject(metadata, 'annotations');
  annotations[AUTH_ANNOTATION] = enabled ? 'true' : 'false';
}

function getAuthAnnotationFromYaml(yamlContent) {
  const doc = parseYamlDocument(yamlContent);
  if (!doc) {
    return undefined;
  }
  const annotations = doc?.metadata?.annotations;
  const rawValue = annotations?.[AUTH_ANNOTATION];
  if (typeof rawValue === 'boolean') {
    return rawValue;
  }
  if (typeof rawValue === 'string') {
    return rawValue.trim().toLowerCase() === 'true';
  }
  return undefined;
}

function isSchedulerEnabled(doc) {
  return Boolean(doc?.spec?.router?.scheduler);
}

function setSchedulerValue(doc, enabled) {
  const spec = ensureNestedObject(doc, 'spec');
  const router = ensureLLMRouterStructure(spec, { includeScheduler: enabled });
  if (!enabled && router && Object.prototype.hasOwnProperty.call(router, 'scheduler')) {
    delete router.scheduler;
  } else if (enabled) {
    router.scheduler = router.scheduler && typeof router.scheduler === 'object' ? router.scheduler : {};
  }
}

function isMaaSEnabled(doc) {
  if (!doc?.spec?.router?.gateway) {
    return false;
  }
  const refs = doc.spec.router.gateway.refs;
  if (!Array.isArray(refs)) {
    return false;
  }
  return refs.some(
    (ref) => ref?.name === 'maas-default-gateway' && ref?.namespace === 'openshift-ingress'
  );
}

function setMaaSGatewayValue(doc, enabled) {
  const spec = ensureNestedObject(doc, 'spec');
  const router = ensureLLMRouterStructure(spec);
  if (enabled) {
    router.gateway = {
      refs: [{ name: 'maas-default-gateway', namespace: 'openshift-ingress' }]
    };
  } else {
    router.gateway = {};
  }
}

function extractReplicaCount(yaml) {
  const match = yaml.match(REPLICA_LINE_REGEX);
  if (match) {
    const count = parseInt(match[2], 10);
    return Number.isFinite(count) && count > 0 ? count : 1;
  }
  return 1;
}

function ensureReplicaCount(yaml, replicas) {
  const sanitized = Math.max(1, Number.isFinite(replicas) ? Math.round(replicas) : 1);
  if (REPLICA_LINE_REGEX.test(yaml)) {
    return yaml.replace(REPLICA_LINE_REGEX, (_, indent) => `${indent}replicas: ${sanitized}`);
  }

  if (SPEC_LINE_REGEX.test(yaml)) {
    return yaml.replace(SPEC_LINE_REGEX, (match) => `${match}\n  replicas: ${sanitized}`);
  }

  const trimmed = yaml.trimEnd();
  const spacer = trimmed.length ? '\n' : '';
  return `${trimmed}${spacer}spec:\n  replicas: ${sanitized}\n`;
}

function extractKindFromYaml(yaml) {
  const match = yaml.match(KIND_LINE_REGEX);
  if (!match) {
    return undefined;
  }

  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function applyReplicaCount(newValue) {
  const sanitized = Math.max(1, Number.isFinite(newValue) ? Math.round(newValue) : 1);
  state.replicaCount = sanitized;
  if (elements.replicaInput) {
    elements.replicaInput.value = String(sanitized);
  }
  if (state.editor) {
    const { base, authSection } = splitAuthSection(state.editor.getValue());
    const updatedBase = ensureReplicaCount(base, sanitized);
    const merged = combineYamlWithAuth(updatedBase, authSection);
    state.editor.setValue(merged.trimEnd() + '\n');
    updateEditorHeight();
  }
}

function handleReplicaInput(event) {
  const value = parseInt(event.target.value, 10);
  applyReplicaCount(value);
}

function handleReplicaControl(button) {
  const delta = button.dataset.replicaControl === 'increment' ? 1 : -1;
  const current = parseInt(elements.replicaInput?.value ?? state.replicaCount, 10);
  applyReplicaCount(Math.max(1, (Number.isFinite(current) ? current : state.replicaCount) + delta));
}

function handleNameInput(event) {
  applyResourceName(event.target.value);
}

function applyResourceValue(type, newValue, { skipEditorUpdate = false } = {}) {
  const def = RESOURCE_FIELDS[type];
  if (!def) {
    return;
  }
  const sanitized = Number.isFinite(newValue) ? Math.max(def.min, newValue) : state.resources[type];
  const normalized =
    def.decimals === 0 ? Math.round(sanitized) : Number(sanitized.toFixed(def.decimals ?? 2));
  state.resources[type] = normalized;
  updateResourceInputs(type);
  if (skipEditorUpdate || !state.editor || !state.isLLMActive) {
    return;
  }
  const currentValue = state.editor.getValue();
  const updated = applyResourceStateToYaml(currentValue, state.resources);
  if (updated !== currentValue) {
    state.editor.setValue(updated.trimEnd() + '\n');
    updateEditorHeight();
  }
}

function handleResourceInput(event) {
  const type = event.target.dataset.resourceInput;
  if (!type) {
    return;
  }
  const value = parseFloat(event.target.value);
  applyResourceValue(type, value);
}

function handleResourceControl(button) {
  const type = button.dataset.resource;
  const action = button.dataset.resourceControl;
  const def = RESOURCE_FIELDS[type];
  if (!def || !action) {
    return;
  }
  const current = state.resources[type] ?? def.min;
  const delta = action === 'increment' ? def.step : -def.step;
  applyResourceValue(type, current + delta);
}

function applyToolCalling(enabled, { skipEditorUpdate = false } = {}) {
  state.toolCallingEnabled = Boolean(enabled);
  updateToolRadios();
  if (skipEditorUpdate || !state.editor || !state.isLLMActive) {
    return;
  }
  const currentValue = state.editor.getValue();
  const updated = updateYamlDocument(currentValue, (doc) => {
    if (!state.toolCallingEnabled) {
      setAdditionalArgsValue(doc, '');
      return;
    }
    let option = findModelOptionById(state.modelSelection);
    if (!option && MODEL_OPTIONS.length) {
      option = MODEL_OPTIONS[0];
      state.modelSelection = option.id;
      if (elements.modelSelect) {
        elements.modelSelect.value = option.id;
      }
    }
    setAdditionalArgsValue(doc, option?.additionalArgs ?? '');
  });
  if (updated !== currentValue) {
    state.editor.setValue(updated.trimEnd() + '\n');
    updateEditorHeight();
  }
}

function handleToolToggle(event) {
  applyToolCalling(event.target.value === 'on');
}

function applyAuthEnabled(enabled, { skipEditorUpdate = false } = {}) {
  state.authEnabled = Boolean(enabled);
  updateAuthRadios();
  if (skipEditorUpdate || !state.editor || !state.isLLMActive) {
    return;
  }
  const currentValue = state.editor.getValue();
  const annotated = updateYamlDocument(currentValue, (doc) => {
    setAuthAnnotationValue(doc, state.authEnabled);
  });
  let nextValue;
  if (state.authEnabled) {
    nextValue = appendAuthSection(annotated, state.resourceName);
  } else {
    nextValue = removeAuthSection(annotated);
  }
  state.editor.setValue(nextValue.trimEnd() + '\n');
  updateEditorHeight();
}

function handleAuthToggle(event) {
  applyAuthEnabled(event.target.value === 'on');
}

function applySmartScheduling(enabled, { skipEditorUpdate = false } = {}) {
  state.smartSchedulingEnabled = Boolean(enabled);
  updateSmartSchedulingRadios();
  if (skipEditorUpdate || !state.editor || !state.isLLMActive) {
    return;
  }
  const currentValue = state.editor.getValue();
  const updated = updateYamlDocument(currentValue, (doc) => {
    setSchedulerValue(doc, state.smartSchedulingEnabled);
  });
  if (updated !== currentValue) {
    state.editor.setValue(updated.trimEnd() + '\n');
    updateEditorHeight();
  }
}

function handleSmartSchedulingToggle(event) {
  applySmartScheduling(event.target.value === 'on');
}

function applyMaaS(enabled, { skipEditorUpdate = false } = {}) {
  state.maasEnabled = Boolean(enabled);
  updateMaaSRadios();
  if (skipEditorUpdate || !state.editor || !state.isLLMActive) {
    return;
  }
  const currentValue = state.editor.getValue();
  const updated = updateYamlDocument(currentValue, (doc) => {
    setMaaSGatewayValue(doc, state.maasEnabled);
  });
  if (updated !== currentValue) {
    state.editor.setValue(updated.trimEnd() + '\n');
    updateEditorHeight();
  }
}

function handleMaaSToggle(event) {
  applyMaaS(event.target.value === 'on');
}

function setShortcutsVisibility(shouldShow) {
  if (!elements.shortcutsPanel || !elements.shortcutsToggle) {
    return;
  }
  elements.shortcutsPanel.hidden = !shouldShow;
  elements.shortcutsToggle.setAttribute('aria-expanded', String(shouldShow));
}

elements.select.addEventListener('change', async (event) => {
  await editorReady;
  setActiveService(event.target.value);
});

elements.copyButton.addEventListener('click', () => {
  handleCopy();
});

if (elements.modelSelect) {
  renderModelOptions();
  elements.modelSelect.addEventListener('change', handleModelChange);
}

if (elements.nameInput) {
  elements.nameInput.addEventListener('input', handleNameInput);
  elements.nameInput.addEventListener('change', handleNameInput);
}

if (elements.resourceInputs?.length) {
  elements.resourceInputs.forEach((input) => {
    input.addEventListener('input', handleResourceInput);
    input.addEventListener('change', handleResourceInput);
  });
}

if (elements.resourceControls?.length) {
  elements.resourceControls.forEach((button) =>
    button.addEventListener('click', () => handleResourceControl(button))
  );
}

if (elements.toolRadios?.length) {
  elements.toolRadios.forEach((radio) => {
    radio.addEventListener('change', handleToolToggle);
  });
}

if (elements.authRadios?.length) {
  elements.authRadios.forEach((radio) => {
    radio.addEventListener('change', handleAuthToggle);
  });
}

if (elements.smartSchedulingRadios?.length) {
  elements.smartSchedulingRadios.forEach((radio) => {
    radio.addEventListener('change', handleSmartSchedulingToggle);
  });
}

if (elements.maasRadios?.length) {
  elements.maasRadios.forEach((radio) => {
    radio.addEventListener('change', handleMaaSToggle);
  });
}

if (elements.replicaInput) {
  elements.replicaInput.addEventListener('change', handleReplicaInput);
  elements.replicaInput.addEventListener('input', handleReplicaInput);
}

if (elements.replicaControls?.length) {
  elements.replicaControls.forEach((button) =>
    button.addEventListener('click', () => {
      handleReplicaControl(button);
    })
  );
}

if (elements.shortcutsToggle && elements.shortcutsPanel) {
  elements.shortcutsToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const expanded = elements.shortcutsToggle.getAttribute('aria-expanded') === 'true';
    setShortcutsVisibility(!expanded);
  });

  document.addEventListener('click', (event) => {
    if (
      !elements.shortcutsPanel.contains(event.target) &&
      !elements.shortcutsToggle.contains(event.target)
    ) {
      setShortcutsVisibility(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setShortcutsVisibility(false);
    }
  });
}

initializeMonaco();
initializeInferenceServices().catch((error) => {
  console.error(error);
  elements.description.textContent = 'Failed to load InferenceServices.';
});

